import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import mongoose, { Model } from 'mongoose';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserSchema, UserDocument } from '../users/schemas/users.schema';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from '../../test/helpers/mongo';

describe('AuthController (HTTP)', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    const uri = await startInMemoryMongo();

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, UsersService],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    userModel = moduleRef.get<Model<UserDocument>>(getModelToken(User.name));
    await userModel.ensureIndexes();
  }, 30000);

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  describe('POST /auth/register', () => {
    test('201 + body on valid input', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'alice@example.com',
          password: 'SecretPass1',
          displayName: 'Alice',
        })
        .expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        email: 'alice@example.com',
        displayName: 'Alice',
        accessToken: expect.any(String),
      });
    });

    test('400 when password is too short', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'a@b.com',
          password: 'short',
          displayName: 'A',
        })
        .expect(400);
    });

    test('400 when email is malformed', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'not-an-email',
          password: 'SecretPass1',
          displayName: 'A',
        })
        .expect(400);
    });

    test('400 when displayName is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'a@b.com',
          password: 'SecretPass1',
        })
        .expect(400);
    });

    test('400 when an unknown field is sent (whitelist)', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'a@b.com',
          password: 'SecretPass1',
          displayName: 'A',
          role: 'admin',
        })
        .expect(400);
    });

    test('409 on duplicate email', async () => {
      const body = {
        email: 'dup@example.com',
        password: 'SecretPass1',
        displayName: 'Dup',
      };
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(body)
        .expect(201);

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(body)
        .expect(409);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'alice@example.com',
        password: 'SecretPass1',
        displayName: 'Alice',
      });
    });

    test('200 + accessToken on valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'SecretPass1',
        })
        .expect(200);

      expect(res.body).toEqual({
        id: expect.any(String),
        email: 'alice@example.com',
        displayName: 'Alice',
        accessToken: expect.any(String),
      });
    });

    test('401 on wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'WrongPass1',
        })
        .expect(401);
    });

    test('401 on unknown email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'SecretPass1',
        })
        .expect(401);
    });

    test('400 on missing fields', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'alice@example.com' })
        .expect(400);
    });
  });
});
