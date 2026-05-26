import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import request from 'supertest';
import { UsersModule } from './users.module';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema, UserDocument } from './schemas/users.schema';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from '../../test/helpers/mongo';

describe('UsersController (HTTP)', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';

    const uri = await startInMemoryMongo();
    const moduleRef = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), UsersModule, AuthModule],
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

    const res = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'me@example.com',
      password: 'SecretPass1',
      displayName: 'Me',
    });

    token = res.body.accessToken;
    userId = res.body.id;
  });

  describe('GET /users/me', () => {
    test('200 + profile when called with a valid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toEqual({
        id: userId,
        name: 'Me',
        email: 'me@example.com',
        createdAt: expect.any(String),
      });
    });

    test('401 without Authorization header', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401);
    });

    test('401 with a modified token', async () => {
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}xxx`)
        .expect(401);
    });

    test('401 with a malformed Authorization header', async () => {
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', token) // missing "Bearer " prefix
        .expect(401);
    });
  });

  describe('GET /users/:id (removed)', () => {
    test('404 — old per-id route no longer exists', async () => {
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
