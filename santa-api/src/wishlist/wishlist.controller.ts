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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistService, type Wishlist } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('wishlists')
@ApiBearerAuth('JWT')
@Controller('rooms/:roomId/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Replace the user`s wishlist in this room.' })
  @ApiBody({ type: UpdateWishlistDto })
  @ApiResponse({ status: 200, description: 'Wishlist saved.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async upsert(
    @Param('roomId') roomId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistService.set(roomId, userId, dto.items);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Read user`s wishlist in this room.' })
  @ApiParam({ name: 'roomId', description: 'Room ObjectId.' })
  @ApiParam({ name: 'userId', description: 'Target user ObjectId.' })
  @ApiResponse({ status: 200, description: 'Wishlist found.' })
  @ApiResponse({ status: 400, description: 'Wishlist not found.' })
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
