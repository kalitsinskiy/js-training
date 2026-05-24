import {
  Controller,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { RoomsService, type Room } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';

interface JoinRoomInput {
  userId: string;
}

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async create(@Body() input: CreateRoomDto): Promise<Room> {
    return this.roomsService.create(input);
  }

  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Room> {
    const room = await this.roomsService.findById(id);

    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }

    return room;
  }

  @Post(':code/join')
  @HttpCode(HttpStatus.OK)
  async join(
    @Param('code') code: string,
    @Body() input: JoinRoomDto,
  ): Promise<Room> {
    const room = await this.roomsService.addMember(code, input.userId);

    if (!room) {
      throw new NotFoundException(`Room with code ${code} not found`);
    }

    return room;
  }
}
