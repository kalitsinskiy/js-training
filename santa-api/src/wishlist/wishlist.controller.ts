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
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistService, type Wishlist } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('rooms/:roomId/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async upsert(
    @Param('roomId') roomId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistService.set(roomId, userId, dto.items);
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
