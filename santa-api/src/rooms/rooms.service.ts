import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

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
  private readonly rooms = new Map<string, Room>();

  create(input: CreateRoomInput): Room {
    const room: Room = {
      id: randomUUID(),
      name: input.name,
      ownerId: input.ownerId,
      code: this.generateUniqueCode(),
      members: [input.ownerId],
      createdAt: new Date(),
    };
    this.rooms.set(room.id, room);

    return room;
  }

  findAll(): Room[] {
    return Array.from(this.rooms.values());
  }

  findById(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  findByCode(code: string): Room | undefined {
    for (const room of this.rooms.values()) {
      if (room.code === code) return room;
    }

    return undefined;
  }

  addMember(code: string, userId: string): Room | undefined {
    const room = this.findByCode(code);

    if (!room) return undefined;
    if (!room.members.includes(userId)) {
      room.members.push(userId);
    }

    return room;
  }

  private generateUniqueCode(): string {
    while (true) {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      if (code.length === 6 && !this.findByCode(code)) return code;
    }
  }
}
