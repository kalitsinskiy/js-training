import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URL ?? 'mongodb://localhost:27017/santa-api',
    ),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'HH:MM:ss',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
      },
    }),
    UsersModule,
    RoomsModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggingInterceptor],
})
export class AppModule {}
