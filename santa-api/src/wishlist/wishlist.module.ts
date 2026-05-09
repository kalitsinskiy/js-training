import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { UsersModule } from 'src/users/users.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  providers: [WishlistService],
  controllers: [WishlistController],
  imports: [UsersModule, RoomsModule],
})
export class WishlistModule {}
