import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('rooms/:roomId/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  set(@Param('roomId') roomId: string, @Body() dto: UpdateWishlistDto) {
    return this.wishlistService.set(roomId, dto.userId, dto.items);
  }

  @Get(':userId')
  get(@Param('roomId') roomId: string, @Param('userId') userId: string) {
    const wishlist = this.wishlistService.get(roomId, userId);
    if (!wishlist) throw new NotFoundException('Wishlist not found');
    return wishlist;
  }
}
