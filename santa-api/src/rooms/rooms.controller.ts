import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import type { Room } from './room.types';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(
    @Body() body: CreateRoomDto,
    @CurrentUser('id') userId: string,
  ): Promise<Room> {
    return this.roomsService.create(body, userId);
  }

  @Get()
  findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Room> {
    return this.roomsService.findById(id);
  }

  @Post(':code/join')
  joinByCode(
    @Param('code') code: string,
    @Body() _body: JoinRoomDto,
    @CurrentUser('id') userId: string,
  ): Promise<Room> {
    return this.roomsService.joinByCode(code, userId);
  }
}
