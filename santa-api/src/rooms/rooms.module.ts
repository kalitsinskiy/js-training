import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { RoomsController } from './rooms.controller';
import { Room, RoomSchema } from './schemas/room.schema';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
