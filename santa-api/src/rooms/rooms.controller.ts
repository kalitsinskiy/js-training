import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateRoomDto, @CurrentUser('id') userId: string) {
    return this.roomsService.create({ name: dto.name, ownerId: userId });
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const room = this.roomsService.findById(id);
    if (!room) {
      throw new NotFoundException(`Room with id "${id}" not found`);
    }
    return room;
  }

  @Post(':code/join')
  join(@Param('code') code: string, @CurrentUser('id') userId: string) {
    const room = this.roomsService.addMember(code, userId);
    if (!room) {
      throw new NotFoundException(`Room with code "${code}" not found`);
    }
    return room;
  }
}
