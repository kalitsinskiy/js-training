import {
  Controller,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RoomsService, type Room } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginatedResponse } from 'src/common/pagination';

@ApiTags('rooms')
@ApiBearerAuth('JWT')
@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Secret Santa room.' })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({ status: 201, description: 'Room created.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRoomDto,
  ): Promise<Room> {
    return this.roomsService.create({ name: dto.name, ownerId: userId });
  }

  @Get()
  @ApiOperation({
    summary: 'List rooms the caller participates in (paginated).',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of rooms. Shape: { data, meta }.',
  })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResponse<Room>> {
    return this.roomsService.findByUser(userId, {
      page: page === undefined ? undefined : Number(page),
      limit: limit === undefined ? undefined : Number(limit),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by id.' })
  @ApiParam({ name: 'id', description: 'Room ObjectId.' })
  @ApiResponse({ status: 200, description: 'Room found.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  async findOne(@Param('id') id: string): Promise<Room> {
    const room = await this.roomsService.findById(id);
    if (!room) throw new NotFoundException(`Room ${id} not found`);
    return room;
  }

  @Post(':code/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join a room by its invite code.' })
  @ApiParam({ name: 'code', description: '6-character invite code.' })
  @ApiResponse({ status: 200, description: 'Joined. Updated room returned.' })
  @ApiResponse({ status: 404, description: 'Not found room with the code.' })
  async join(
    @Param('code') code: string,
    @CurrentUser('id') userId: string,
  ): Promise<Room> {
    const room = await this.roomsService.addMember(code, userId);
    if (!room) throw new NotFoundException(`Room with code ${code} not found`);
    return room;
  }
}
