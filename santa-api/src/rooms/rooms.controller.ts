import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const room = this.roomsService.findById(id);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  @Post(':code/join')
  join(@Param('code') code: string, @Body() dto: JoinRoomDto) {
    const room = this.roomsService.addMember(code, dto.userId);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }
}
