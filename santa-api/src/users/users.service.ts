import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User as UserSchemaClass, UserDocument } from './schemas/users.shcema';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(input: CreateUserInput): Promise<User> {
    const doc = await this.userModel.create({
      email: input.email,
      displayName: input.name,
      passwordHash: 'TODO_LESSON_08',
    });

    return this.toPublic(doc);
  }

  async findById(id: string): Promise<User | undefined> {
    if (!Types.ObjectId.isValid(id)) return undefined;

    const doc = await this.userModel.findById(id);
    return doc ? this.toPublic(doc) : undefined;
  }

  private toPublic(doc: UserDocument): User {
    return {
      id: doc._id.toString(),
      name: doc.displayName,
      email: doc.email,
      createdAt: doc.get('createdAt'),
    };
  }
}
