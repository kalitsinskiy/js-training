import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }
}
