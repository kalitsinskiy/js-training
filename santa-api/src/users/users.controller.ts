import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { User } from './user.types';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findCurrent(@CurrentUser('id') userId: string): Promise<User> {
    return this.usersService.findById(userId);
  }

  @Patch('me')
  updateCurrent(
    @CurrentUser('id') userId: string,
    @Body() body: UpdateCurrentUserDto,
  ): Promise<User> {
    return this.usersService.updateCurrentUser(userId, body);
  }
}
