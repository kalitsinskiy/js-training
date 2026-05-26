import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserSchema, UserDocument } from '../users/schemas/users.schema';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from '../../test/helpers/mongo';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    const uri = await startInMemoryMongo();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));

    await userModel.ensureIndexes();
  }, 30000);

  afterAll(async () => {
    await mongoose.disconnect();
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  describe('register', () => {
    test('creates a user and returns an accessToken', async () => {
      const result = await service.register({
        email: 'alice@example.com',
        password: 'SecretPass1',
        displayName: 'Alice',
      });

      expect(result).toEqual({
        id: expect.any(String),
        email: 'alice@example.com',
        displayName: 'Alice',
        accessToken: expect.any(String),
      });
      expect(result.accessToken.split('.')).toHaveLength(3);
    });

    test('does NOT return the passwordHash', async () => {
      const result = await service.register({
        email: 'bob@example.com',
        password: 'SecretPass1',
        displayName: 'Bob',
      });

      expect((result as any).passwordHash).toBeUndefined();
    });

    test('hashes the password - does NOT store plain text', async () => {
      await service.register({
        email: 'carol@example.com',
        password: 'SecretPass1',
        displayName: 'Carol',
      });

      const stored = await usersService.findByEmail('carol@example.com', {
        withPassword: true,
      });

      expect(stored?.passwordHash).not.toBe('SecretPass1');
      expect(await bcrypt.compare('SecretPass1', stored!.passwordHash)).toBe(
        true,
      );
    });

    test('lowercase the email before save', async () => {
      const result = await service.register({
        email: 'Alice@Example.com',
        password: 'SecretPass1',
        displayName: 'Alice',
      });

      expect(result.email).toBe('alice@example.com');
    });

    test('throws ConflictException on duplicate email', async () => {
      await service.register({
        email: 'bob@example.com',
        password: 'SecretPass1',
        displayName: 'Bob',
      });

      await expect(
        service.register({
          email: 'bob@example.com',
          password: 'SecretPass2',
          displayName: 'Bob2',
        }),
      ).rejects.toThrow(ConflictException);
    });

    test('treats different-case duplicate email as conflict', async () => {
      await service.register({
        email: 'carol@example.com',
        password: 'SecretPass1',
        displayName: 'Carol',
      });

      await expect(
        service.register({
          email: 'CAROL@example.com',
          password: 'SecretPass1',
          displayName: 'Carol',
        }),
      ).rejects.toThrow(ConflictException);
    });

    test('JWT payload has sub=userId, email, role=user', async () => {
      const result = await service.register({
        email: 'alice@example.com',
        password: 'SecretPass1',
        displayName: 'Alice',
      });

      const payload = jwtService.verify(result.accessToken);

      expect(payload.sub).toBe(result.id);
      expect(payload.email).toBe('alice@example.com');
      expect(payload.role).toBe('user');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await service.register({
        email: 'alice@example.com',
        password: 'SecretPass1',
        displayName: 'Alice',
      });
    });

    test('returns an accessToken on valid credentials', async () => {
      const result = await service.login({
        email: 'alice@example.com',
        password: 'SecretPass1',
      });

      expect(result).toEqual({
        id: expect.any(String),
        email: 'alice@example.com',
        displayName: 'Alice',
        accessToken: expect.any(String),
      });
    });

    test('accept the email of any case', async () => {
      const result = await service.login({
        email: 'ALICE@example.com',
        password: 'SecretPass1',
      });

      expect(result.email).toBe('alice@example.com');
    });

    test('throws UnauthorizedException on wrong password', async () => {
      await expect(
        service.login({ email: 'alice@example.com', password: 'WrongPass1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    test('throws UnauthorizedException on unknown email', async () => {
      await expect(
        service.login({ email: 'nobody@example.com', password: 'SecretPass1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    test('uses the SAME error message for unknown email and wrong password', async () => {
      let wrongPwError: any;
      let unknownEmailError: any;

      try {
        await service.login({
          email: 'alice@example.com',
          password: 'WrongPass1',
        });
      } catch (e) {
        wrongPwError = e;
      }
      try {
        await service.login({
          email: 'nobody@example.com',
          password: 'SecretPass1',
        });
      } catch (e) {
        unknownEmailError = e;
      }

      expect(wrongPwError).toBeDefined();
      expect(unknownEmailError).toBeDefined();
      expect(wrongPwError.message).toBe(unknownEmailError.message);
    });

    test('JWT payload has sub=userId, email, role=user', async () => {
      const result = await service.login({
        email: 'alice@example.com',
        password: 'SecretPass1',
      });

      const payload = jwtService.verify(result.accessToken);

      expect(payload.sub).toBe(result.id);
      expect(payload.email).toBe('alice@example.com');
      expect(payload.role).toBe('user');
    });

    test('does NOT return the passwordHash', async () => {
      const result = await service.login({
        email: 'alice@example.com',
        password: 'SecretPass1',
      });

      expect((result as any).passwordHash).toBeUndefined();
    });
  });
});
