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
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistService, type Wishlist } from './wishlist.service';

@Controller('rooms/:roomId/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async upsert(
    @Param('roomId') roomId: string,
    @Body() dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistService.set(roomId, dto.userId, dto.items);
  }

  @Get(':userId')
  async findOne(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistService.get(roomId, userId);

    if (!wishlist) {
      throw new NotFoundException(
        `Wishlist for user ${userId} in room ${roomId} not found`,
      );
    }

    return wishlist;
  }
}
