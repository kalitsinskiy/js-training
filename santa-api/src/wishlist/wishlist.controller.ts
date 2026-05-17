import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistService } from './wishlist.service';
import type { Wishlist } from './wishlist.types';

@Controller('rooms/:roomId/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  update(
    @Param('roomId') roomId: string,
    @CurrentUser('id') userId: string,
    @Body() body: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistService.set(roomId, userId, body.items);
  }

  @Get('me')
  async findOne(
    @Param('roomId') roomId: string,
    @CurrentUser('id') userId: string,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistService.get(roomId, userId);

    if (!wishlist) {
      throw new NotFoundException(
        `Wishlist for room ${roomId} and user ${userId} not found`,
      );
    }

    return wishlist;
  }
}
