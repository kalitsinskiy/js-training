import {
  Controller,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomsService, type Room } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRoomDto,
  ): Promise<Room> {
    return this.roomsService.create({ name: dto.name, ownerId: userId });
  }

  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Room> {
    const room = await this.roomsService.findById(id);
    if (!room) throw new NotFoundException(`Room ${id} not found`);
    return room;
  }

  @Post(':code/join')
  @HttpCode(HttpStatus.OK)
  async join(
    @Param('code') code: string,
    @CurrentUser('id') userId: string,
  ): Promise<Room> {
    const room = await this.roomsService.addMember(code, userId);
    if (!room) throw new NotFoundException(`Room with code ${code} not found`);
    return room;
  }
}
