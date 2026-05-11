import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [UsersModule, RoomsModule, WishlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
