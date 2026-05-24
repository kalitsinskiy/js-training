import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room as RoomSchemaClass, RoomDocument } from './schemas/room.schema';

export interface Room {
  id: string;
  name: string;
  ownerId: string;
  code: string;
  members: string[];
  createdAt: Date;
}

export interface CreateRoomInput {
  name: string;
  ownerId: string;
}

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(RoomSchemaClass.name)
    private readonly roomModel: Model<RoomDocument>,
  ) {}

  async create(input: CreateRoomInput): Promise<Room> {
    const inviteCode = await this.generateUniqueCode();
    const doc = await this.roomModel.create({
      name: input.name,
      creatorId: input.ownerId,
      inviteCode,
      participants: [input.ownerId],
    });
    return this.toPublic(doc);
  }

  async findAll(): Promise<Room[]> {
    const docs = await this.roomModel.find();
    return docs.map((doc) => this.toPublic(doc));
  }

  async findById(id: string): Promise<Room | undefined> {
    if (!Types.ObjectId.isValid(id)) return undefined;
    const doc = await this.roomModel.findById(id);
    return doc ? this.toPublic(doc) : undefined;
  }

  async findByCode(code: string): Promise<Room | undefined> {
    const doc = await this.roomModel.findOne({ inviteCode: code });
    return doc ? this.toPublic(doc) : undefined;
  }

  async addMember(code: string, userId: string): Promise<Room | undefined> {
    const doc = await this.roomModel.findOneAndUpdate(
      { inviteCode: code },
      { $addToSet: { participants: userId } },
      { new: true },
    );
    return doc ? this.toPublic(doc) : undefined;
  }

  private async generateUniqueCode(): Promise<string> {
    while (true) {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      if (code.length !== 6) continue;
      const exists = await this.roomModel.exists({ inviteCode: code });
      if (!exists) return code;
    }
  }

  private toPublic(doc: RoomDocument): Room {
    return {
      id: doc._id.toString(),
      name: doc.name,
      ownerId: doc.creatorId,
      code: doc.inviteCode,
      members: doc.participants,
      createdAt: doc.get('createdAt'),
    };
  }
}
