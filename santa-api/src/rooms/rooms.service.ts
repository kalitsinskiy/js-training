import { Injectable } from '@nestjs/common';

export interface Room {
  id: string;
  name: string;
  ownerId: string;
  code: string;
  members: string[];
  createdAt: Date;
}

@Injectable()
export class RoomsService {
  private readonly rooms = new Map<string, Room>();

  create({ name, ownerId }: { name: string; ownerId: string }): Room {
    const room: Room = {
      id: crypto.randomUUID(),
      name,
      ownerId,
      code: Math.random().toString(36).slice(2, 8).toUpperCase(),
      members: [ownerId],
      createdAt: new Date(),
    };
    this.rooms.set(room.id, room);
    return room;
  }

  findAll(): Room[] {
    return [...this.rooms.values()];
  }

  findById(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  findByCode(code: string): Room | undefined {
    return [...this.rooms.values()].find((r) => r.code === code);
  }

  addMember(code: string, userId: string): Room | undefined {
    const room = this.findByCode(code);
    if (!room) return undefined;
    if (!room.members.includes(userId)) {
      room.members.push(userId);
    }
    return room;
  }
}
