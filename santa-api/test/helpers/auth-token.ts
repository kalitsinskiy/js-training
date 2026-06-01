import { JwtService } from '@nestjs/jwt';

export interface TokenUser {
  _id: { toString(): string } | string;
  email: string;
  role?: 'user' | 'admin';
}

export function tokenFor(jwt: JwtService, user: TokenUser): string {
  const sub = typeof user._id === 'string' ? user._id : user._id.toString();

  return jwt.sign({
    sub,
    email: user.email,
    role: user.role ?? 'user',
  });
}
