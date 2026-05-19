import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(dto: {
    email: string;
    displayName: string;
    passwordHash: string;
    role?: 'user' | 'admin';
  }) {
    return this.userModel.create({
      email: dto.email,
      displayName: dto.displayName,
      passwordHash: dto.passwordHash,
      role: dto.role ?? 'user',
    });
  }

  findByEmail(email: string, opts: { withPassword?: boolean } = {}) {
    const query = this.userModel.findOne({ email: email.toLowerCase() });
    if (opts.withPassword) {
      query.select('+passwordHash');
    }
    return query.exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  updateById(id: string, dto: { displayName?: string }) {
    return this.userModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
  }
}
