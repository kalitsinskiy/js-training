import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email,
      displayName: dto.displayName,
      passwordHash,
      role: 'user',
    });

    const accessToken = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      accessToken,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();
    const user = await this.usersService.findByEmail(email, {
      withPassword: true,
    });

    const passwordMatch =
      user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }
}
