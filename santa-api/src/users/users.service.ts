import { Injectable } from '@nestjs/common';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private readonly users = new Map<string, User>();

  create({ name, email }: { name: string; email: string }): User {
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }
}
