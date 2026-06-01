import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import {
  paginate,
  PaginatedResponse,
  PaginationQuery,
} from '../common/pagination';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './room.types';
import { Room as RoomModel, RoomDocument } from './schemas/room.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(RoomModel.name)
    private readonly roomModel: Model<RoomModel>,
    private readonly usersService: UsersService,
  ) {}

  async create({ name }: CreateRoomDto, ownerId: string): Promise<Room> {
    await this.usersService.findById(ownerId);

    const room = await this.roomModel.create({
      name,
      creatorId: ownerId,
      inviteCode: await this.generateCode(),
      participants: [ownerId],
      status: 'pending',
    });

    return this.toRoom(room);
  }

  async findByUser(
    userId: string,
    query: PaginationQuery,
  ): Promise<PaginatedResponse<Room>> {
    const result = await paginate(
      this.roomModel,
      { participants: userId },
      query,
    );

    return {
      data: result.data.map((room) => this.toRoom(room as RoomDocument)),
      meta: result.meta,
    };
  }

  async findById(id: string): Promise<Room> {
    const room = await this.findRoomDocumentById(id);

    return this.toRoom(room);
  }

  async findByIdForUser(id: string, userId: string): Promise<Room> {
    const room = await this.findRoomDocumentById(id);

    if (
      !room.participants.some(
        (participant) => participant.toString() === userId,
      )
    ) {
      throw new ForbiddenException(`Room ${id} is not accessible`);
    }

    return this.toRoom(room);
  }

  async join(code: string, userId: string): Promise<Room> {
    await this.usersService.findById(userId);

    const existingRoom = await this.roomModel
      .findOne({ inviteCode: code })
      .exec();

    if (!existingRoom) {
      throw new NotFoundException(`Room with code ${code} not found`);
    }

    if (existingRoom.status === 'drawn') {
      throw new ForbiddenException('Room draw has already been completed');
    }

    const room = await this.roomModel
      .findOneAndUpdate(
        { inviteCode: code },
        { $addToSet: { participants: userId } },
        { new: true },
      )
      .exec();

    if (!room) {
      throw new NotFoundException(`Room with code ${code} not found`);
    }

    return this.toRoom(room);
  }

  async joinByCode(code: string, userId: string): Promise<Room> {
    return this.join(code, userId);
  }

  async draw(id: string): Promise<Room> {
    const room = await this.findRoomDocumentById(id);

    if (room.participants.length < 3) {
      throw new BadRequestException(
        'At least 3 participants are required to draw',
      );
    }

    const drawDate = new Date();
    const assignments = this.buildAssignments(room.participants);
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(
        id,
        {
          status: 'drawn',
          drawDate,
          assignments,
        },
        { new: true },
      )
      .exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Room ${id} not found`);
    }

    return this.toRoom(updatedRoom);
  }

  private async generateCode(): Promise<string> {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    while (true) {
      const inviteCode = Array.from({ length: 6 }, () => {
        const index = Math.floor(Math.random() * alphabet.length);
        return alphabet[index];
      }).join('');

      const existingRoom = await this.roomModel
        .findOne({ inviteCode })
        .select('_id')
        .lean()
        .exec();

      if (!existingRoom) {
        return inviteCode;
      }
    }
  }

  private async findRoomDocumentById(id: string): Promise<RoomDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Room ${id} not found`);
    }

    const room = await this.roomModel.findById(id).exec();

    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }

    return room;
  }

  private buildAssignments(
    participants: Types.ObjectId[],
  ): Array<{ giverId: Types.ObjectId; receiverId: Types.ObjectId }> {
    const shuffledParticipants = [...participants];

    for (let index = shuffledParticipants.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const currentParticipant = shuffledParticipants[index];

      shuffledParticipants[index] = shuffledParticipants[swapIndex];
      shuffledParticipants[swapIndex] = currentParticipant;
    }

    const hasSelfAssignment = shuffledParticipants.some((participant, index) =>
      participant.equals(participants[index]),
    );

    if (hasSelfAssignment) {
      const rotatedParticipants = [...participants.slice(1), participants[0]];

      return participants.map((participant, index) => ({
        giverId: participant,
        receiverId: rotatedParticipants[index],
      }));
    }

    return participants.map((participant, index) => ({
      giverId: participant,
      receiverId: shuffledParticipants[index],
    }));
  }

  private toRoom(room: RoomDocument): Room {
    return {
      id: room._id.toString(),
      name: room.name,
      ownerId: room.creatorId.toString(),
      code: room.inviteCode,
      members: room.participants.map((participant) => participant.toString()),
      status: room.status,
      drawDate: room.drawDate?.toISOString(),
    };
  }
}
