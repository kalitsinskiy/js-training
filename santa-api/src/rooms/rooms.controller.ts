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
  async create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const room = await this.roomsService.findById(id);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  @Post(':code/join')
  async join(@Param('code') code: string, @Body() dto: JoinRoomDto) {
    const room = await this.roomsService.addMember(code, dto.userId);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }
}
