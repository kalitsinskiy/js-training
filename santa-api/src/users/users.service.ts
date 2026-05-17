import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  create(dto: CreateUserDto) {
    return this.userModel.create({
      email: dto.email,
      displayName: dto.name,
      passwordHash: 'TODO_LESSON_08',
    });
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}
