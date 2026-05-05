import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

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
  private readonly users = new Map<string, User>();

  create(input: CreateUserInput) {
    const user: User = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }
}
