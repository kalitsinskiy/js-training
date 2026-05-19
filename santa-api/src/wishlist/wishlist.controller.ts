import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('rooms/:roomId/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  set(
    @Param('roomId') roomId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateWishlistDto,
  ) {
    return this.wishlistService.set(roomId, userId, dto.items);
  }

  @Get(':userId')
  get(@Param('roomId') roomId: string, @Param('userId') userId: string) {
    const wishlist = this.wishlistService.get(roomId, userId);
    if (!wishlist) {
      throw new NotFoundException(
        `Wishlist for user "${userId}" in room "${roomId}" not found`,
      );
    }
    return wishlist;
  }
}
