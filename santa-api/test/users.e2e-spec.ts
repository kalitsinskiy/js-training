import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Connection, Model } from 'mongoose';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerStorage } from '@nestjs/throttler';
import { AppModule } from '../src/app.module';
import { User, UserDocument } from '../src/users/schemas/users.schema';
import { startInMemoryMongo, stopInMemoryMongo } from './helpers/mongo';
import { userFixture } from './helpers/factories';
import { tokenFor } from './helpers/auth-token';

describe('UsersController (e2e)', () => {
  let app: NestFastifyApplication;
  let connection: Connection;
  let jwt: JwtService;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await startInMemoryMongo();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ThrottlerStorage)
      .useValue({
        increment: async () => ({
          totalHits: 0,
          timeToExpire: 0,
          isBlocked: false,
          timeToBlockExpire: 0,
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    connection = app.get<Connection>(getConnectionToken());
    jwt = app.get(JwtService);
    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterAll(async () => {
    await app.close();
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
  });

  describe('GET /users/me', () => {
    test('returns the authenticated user profile (200) with id, name, email, createdAt', async () => {
      const fixture = userFixture({
        email: 'me@test.com',
        displayName: 'Me User',
      });
      await userModel.create(fixture);
      const token = tokenFor(jwt, fixture);

      const res = await app
        .getHttpAdapter()
        .getInstance()
        .inject({
          method: 'GET',
          url: '/users/me',
          headers: { authorization: `Bearer ${token}` },
        });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual({
        id: fixture._id.toString(),
        name: 'Me User',
        email: 'me@test.com',
        createdAt: expect.any(String),
      });
    });

    test('returns 401 without a token', async () => {
      const res = await app
        .getHttpAdapter()
        .getInstance()
        .inject({ method: 'GET', url: '/users/me' });

      expect(res.statusCode).toBe(401);
    });

    test('returns 401 with a malformed Authorization header', async () => {
      const res = await app
        .getHttpAdapter()
        .getInstance()
        .inject({
          method: 'GET',
          url: '/users/me',
          headers: { authorization: 'Bearer not-a-real-jwt' },
        });

      expect(res.statusCode).toBe(401);
    });

    test('returns 404 when the token points to a user that no longer exists', async () => {
      const fixture = userFixture({ email: 'ghost@test.com' });
      const token = tokenFor(jwt, fixture);

      const res = await app
        .getHttpAdapter()
        .getInstance()
        .inject({
          method: 'GET',
          url: '/users/me',
          headers: { authorization: `Bearer ${token}` },
        });

      expect(res.statusCode).toBe(404);
    });
  });
});
