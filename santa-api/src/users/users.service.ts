import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.types';

@Injectable()
export class UsersService {
  private readonly users = new Map<string, User>();

  create({ name, email }: CreateUserDto): User {
    const user: User = {
      id: randomUUID(),
      name,
      email,
    };

    this.users.set(user.id, user);
    return user;
  }

  findById(id: string): User {
    const user = this.users.get(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }
}
