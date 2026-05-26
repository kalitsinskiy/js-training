import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User as UserSchemaClass, UserDocument } from './schemas/users.schema';

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

export interface CreateUserWithHashInput {
  email: string;
  displayName: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createWithHash(input: CreateUserWithHashInput): Promise<UserDocument> {
    return this.userModel.create({
      email: input.email.toLowerCase(),
      displayName: input.displayName,
      passwordHash: input.passwordHash,
    });
  }

  async findById(id: string): Promise<User | undefined> {
    if (!Types.ObjectId.isValid(id)) return undefined;

    const doc = await this.userModel.findById(id);
    return doc ? this.toPublic(doc) : undefined;
  }

  async findByEmail(
    email: string,
    opts: { withPassword?: boolean } = {},
  ): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ email: email.toLowerCase() });

    if (opts.withPassword) {
      query.select('+passwordHash');
    }

    return query.exec();
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
