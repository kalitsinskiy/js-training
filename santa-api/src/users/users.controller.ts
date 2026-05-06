import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import type { User } from './user.types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateUserDto): User {
    return this.usersService.create(body);
  }

  @Get(':id')
  findById(@Param('id') id: string): User {
    return this.usersService.findById(id);
  }
}
