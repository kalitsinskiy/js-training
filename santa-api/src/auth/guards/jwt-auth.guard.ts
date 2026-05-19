import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T>(err: any, user: T, info: any): T {
    if (err || !user) {
      throw new UnauthorizedException(
        info?.message ?? 'Authentication required',
      );
    }
    return user;
  }
}
