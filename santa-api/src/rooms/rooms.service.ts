import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { Room } from './room.types';
import { Room as RoomModel } from './schemas/room.schema';

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
    });

    return this.toRoom(room);
  }

  async findAll(): Promise<Room[]> {
    const rooms = await this.roomModel.find().exec();
    return rooms.map((room) => this.toRoom(room));
  }

  async findById(id: string): Promise<Room> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Room ${id} not found`);
    }

    const room = await this.roomModel.findById(id).exec();

    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }

    return this.toRoom(room);
  }

  async joinByCode(code: string, userId: string): Promise<Room> {
    await this.usersService.findById(userId);

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

  private toRoom(room: {
    _id: Types.ObjectId;
    name: string;
    creatorId: Types.ObjectId;
    inviteCode: string;
    participants: Types.ObjectId[];
    status: 'pending' | 'drawn';
    drawDate?: Date;
  }): Room {
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
