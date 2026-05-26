import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import mongoose from 'mongoose';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from '../../test/helpers/mongo';

describe('AuthModule (witing)', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  test('compiles with all providers resolvable', async () => {
    const uri = await startInMemoryMongo();
    const module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), AuthModule],
    }).compile();

    expect(module.get(AuthService)).toBeDefined();
    expect(module.get(JwtStrategy)).toBeDefined();
    expect(module.get(JwtAuthGuard)).toBeDefined();
    expect(module.get(JwtService)).toBeDefined();

    await mongoose.disconnect();
    await stopInMemoryMongo();
  }, 30000);

  test('JwtStrategy throws if JWT_SECRET is not set', () => {
    delete process.env.JWT_SECRET;

    expect(() => new JwtStrategy()).toThrow('JWT_SECRET is not set');

    process.env.JWT_SECRET = 'test-secret';
  });
});
