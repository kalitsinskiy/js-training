import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistService } from './wishlist.service';
import type { Wishlist } from './wishlist.types';

@Controller('rooms/:roomId/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  update(
    @Param('roomId') roomId: string,
    @Body() body: UpdateWishlistDto,
  ): Wishlist {
    return this.wishlistService.set(roomId, body.userId, body.items);
  }

  @Get(':userId')
  findOne(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
  ): Wishlist {
    const wishlist = this.wishlistService.get(roomId, userId);

    if (!wishlist) {
      throw new NotFoundException(
        `Wishlist for room ${roomId} and user ${userId} not found`,
      );
    }

    return wishlist;
  }
}
