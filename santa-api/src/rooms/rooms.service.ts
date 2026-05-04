import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UsersService } from '../users/users.service';
import { CreateRoomDto, JoinRoomDto, Room } from './room.types';

@Injectable()
export class RoomsService {
  private readonly rooms = new Map<string, Room>();

  constructor(private readonly usersService: UsersService) {}

  create({ name, ownerId }: CreateRoomDto): Room {
    this.usersService.findById(ownerId);

    const room: Room = {
      id: randomUUID(),
      name,
      ownerId,
      code: this.generateCode(),
      members: [ownerId],
    };

    this.rooms.set(room.id, room);
    return room;
  }

  findAll(): Room[] {
    return Array.from(this.rooms.values());
  }

  findById(id: string): Room {
    const room = this.rooms.get(id);

    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }

    return room;
  }

  joinByCode(code: string, { userId }: JoinRoomDto): Room {
    this.usersService.findById(userId);

    const room = this.findByCode(code);
    if (!room.members.includes(userId)) {
      room.members.push(userId);
    }

    return room;
  }

  private findByCode(code: string): Room {
    const room = Array.from(this.rooms.values()).find(
      (candidate) => candidate.code === code,
    );

    if (!room) {
      throw new NotFoundException(`Room with code ${code} not found`);
    }

    return room;
  }

  private generateCode(): string {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';

    do {
      code = Array.from({ length: 6 }, () => {
        const index = Math.floor(Math.random() * alphabet.length);
        return alphabet[index];
      }).join('');
    } while (
      Array.from(this.rooms.values()).some((room) => room.code === code)
    );

    return code;
  }
}
