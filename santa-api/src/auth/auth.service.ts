import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface AuthResult {
  id: string;
  email: string;
  displayName: string;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const email = dto.email.toLowerCase();

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createWithHash({
      email,
      displayName: dto.displayName,
      passwordHash,
    });

    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      accessToken: this.signToken(user._id.toString(), user.email, user.role),
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(dto.email, {
      withPassword: true,
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      accessToken: this.signToken(user._id.toString(), user.email, user.role),
    };
  }

  private signToken(sub: string, email: string, role: string): string {
    return this.jwtService.sign({ sub, email, role });
  }
}
