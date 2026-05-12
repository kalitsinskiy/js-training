import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.types';
import { User as UserModel } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async create({ name, email }: CreateUserDto): Promise<User> {
    const user = await this.userModel.create({
      email,
      displayName: name,
      passwordHash: 'TODO_LESSON_08',
    });

    return this.toUser(user);
  }

  async findById(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.toUser(user);
  }

  private toUser(user: {
    _id: Types.ObjectId;
    displayName: string;
    email: string;
    role: 'user' | 'admin';
  }): User {
    return {
      id: user._id.toString(),
      name: user.displayName,
      email: user.email,
      role: user.role,
    };
  }
}
