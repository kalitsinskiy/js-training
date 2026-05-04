import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { CreateRoomDto, JoinRoomDto, Room } from './room.types';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() body: CreateRoomDto): Room {
    return this.roomsService.create(body);
  }

  @Get()
  findAll(): Room[] {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Room {
    return this.roomsService.findById(id);
  }

  @Post(':code/join')
  joinByCode(@Param('code') code: string, @Body() body: JoinRoomDto): Room {
    return this.roomsService.joinByCode(code, body);
  }
}
