import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import type { Connection } from 'mongoose';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/configure-app';

type ErrorBody = {
  success: boolean;
  statusCode: number;
  message: string | string[];
  timestamp: string;
};

type UserBody = {
  id: string;
  displayName: string;
  email: string;
  role: 'user' | 'admin';
};

type AuthBody = UserBody & {
  accessToken: string;
};

type RoomBody = {
  id: string;
  name: string;
  ownerId: string;
  code: string;
  members: string[];
  status: 'pending' | 'drawn';
  drawDate?: string;
};

type WishlistItemBody = {
  name: string;
  url?: string;
  priority?: number;
};

type WishlistBody = {
  roomId: string;
  userId: string;
  items: WishlistItemBody[];
};

describe('Santa API (e2e)', () => {
  let app: NestFastifyApplication;
  const mongoUrl = `mongodb://localhost:27017/santa-api-e2e-${randomUUID()}`;

  beforeAll(() => {
    process.env.MONGO_URL = mongoUrl;
    process.env.JWT_SECRET = 'test-secret';
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    configureApp(app);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    const connection = app.get<Connection>(getConnectionToken());
    if (!connection.db) {
      throw new Error('MongoDB connection is not ready');
    }

    await connection.db.dropDatabase();
  });

  async function registerUser(
    email: string,
    displayName: string,
    password = 'SecretPass1',
  ): Promise<AuthBody> {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password,
        displayName,
      })
      .expect(201);

    return response.body as AuthBody;
  }

  function withAuth(token: string): { Authorization: string } {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  it('registers, logs in, and returns the authenticated profile', async () => {
    const registeredUser = await registerUser(
      'owner@santa.test',
      'Owner Participant',
    );

    await request(app.getHttpServer())
      .get('/api/users/me')
      .set(withAuth(registeredUser.accessToken))
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          id: registeredUser.id,
          email: 'owner@santa.test',
          displayName: 'Owner Participant',
          role: 'user',
        });
      });

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'OWNER@santa.test',
        password: 'SecretPass1',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toEqual(expect.any(String));
      });
  });

  it('rejects duplicate registration and invalid login credentials', async () => {
    await registerUser('alice@santa.test', 'Alice');

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'alice@santa.test',
        password: 'SecretPass1',
        displayName: 'Alice Again',
      })
      .expect(409)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error).toMatchObject({
          success: false,
          statusCode: 409,
          message: 'Email is already registered',
        });
      });

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'alice@santa.test',
        password: 'wrongpass',
      })
      .expect(401)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error).toMatchObject({
          success: false,
          statusCode: 401,
          message: 'Invalid credentials',
        });
      });
  });

  it('requires a valid token for protected routes', async () => {
    const registeredUser = await registerUser('token@santa.test', 'Token User');

    await request(app.getHttpServer()).get('/api/users/me').expect(401);

    await request(app.getHttpServer())
      .get('/api/users/me')
      .set(withAuth(`${registeredUser.accessToken}tampered`))
      .expect(401);
  });

  it('creates rooms, lists them, and joins by code as authenticated users', async () => {
    const owner = await registerUser('owner@santa.test', 'Owner Participant');
    const member = await registerUser(
      'helper@santa.test',
      'Helper Participant',
    );

    const roomResponse = await request(app.getHttpServer())
      .post('/api/rooms')
      .set(withAuth(owner.accessToken))
      .send({
        name: 'North Pole Ops',
      })
      .expect(201);
    const room = roomResponse.body as RoomBody;

    expect(room).toMatchObject({
      name: 'North Pole Ops',
      ownerId: owner.id,
      members: [owner.id],
      status: 'pending',
    });
    expect(room.code).toHaveLength(6);

    await request(app.getHttpServer())
      .get('/api/rooms')
      .set(withAuth(owner.accessToken))
      .expect(200)
      .expect([room]);

    await request(app.getHttpServer())
      .get(`/api/rooms/${room.id}`)
      .set(withAuth(owner.accessToken))
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(room);
      });

    const joinedRoomResponse = await request(app.getHttpServer())
      .post(`/api/rooms/${room.code}/join`)
      .set(withAuth(member.accessToken))
      .send({})
      .expect(201);
    const joinedRoom = joinedRoomResponse.body as RoomBody;

    expect(joinedRoom.members).toEqual([owner.id, member.id]);
  });

  it('updates the authenticated user profile', async () => {
    const registeredUser = await registerUser(
      'profile@santa.test',
      'Profile User',
    );

    await request(app.getHttpServer())
      .patch('/api/users/me')
      .set(withAuth(registeredUser.accessToken))
      .send({ displayName: 'Updated Profile User' })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          id: registeredUser.id,
          email: 'profile@santa.test',
          displayName: 'Updated Profile User',
          role: 'user',
        });
      });
  });

  it('returns 404 for missing rooms', async () => {
    const registeredUser = await registerUser(
      'missing@santa.test',
      'Missing User',
    );

    await request(app.getHttpServer())
      .get('/api/rooms/missing-room')
      .set(withAuth(registeredUser.accessToken))
      .expect(404)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error).toMatchObject({
          success: false,
          statusCode: 404,
          message: 'Room missing-room not found',
        });
        expect(error.timestamp).toEqual(expect.any(String));
      });

    await request(app.getHttpServer())
      .post('/api/rooms/MISSING/join')
      .set(withAuth(registeredUser.accessToken))
      .send({})
      .expect(404)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error).toMatchObject({
          success: false,
          statusCode: 404,
          message: 'Room with code MISSING not found',
        });
      });
  });

  it('rejects invalid request bodies and unknown properties', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'nope', password: 'short', displayName: '' })
      .expect(400)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error.success).toBe(false);
        expect(error.statusCode).toBe(400);
        expect(error.message).toEqual(
          expect.arrayContaining([
            'email must be an email',
            'password must be longer than or equal to 8 characters',
            'displayName must be longer than or equal to 1 characters',
          ]),
        );
      });

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'alice@santa.test',
        password: 'SecretPass1',
        displayName: 'Alice',
        admin: true,
      })
      .expect(400)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error.success).toBe(false);
        expect(error.statusCode).toBe(400);
        expect(error.message).toContain('property admin should not exist');
      });
  });

  it('stores and retrieves the authenticated user wishlist', async () => {
    const owner = await registerUser(
      'wishlist-owner@santa.test',
      'Wishlist Owner',
    );

    const roomResponse = await request(app.getHttpServer())
      .post('/api/rooms')
      .set(withAuth(owner.accessToken))
      .send({
        name: 'Wishlist Room',
      })
      .expect(201);
    const room = roomResponse.body as RoomBody;

    const updateResponse = await request(app.getHttpServer())
      .post(`/api/rooms/${room.id}/wishlist`)
      .set(withAuth(owner.accessToken))
      .send({
        items: [
          { name: 'socks', priority: 1 },
          { name: 'book' },
          { name: 'mug', url: 'https://example.com/mug' },
        ],
      })
      .expect(201);
    const wishlist = updateResponse.body as WishlistBody;

    expect(wishlist).toEqual({
      roomId: room.id,
      userId: owner.id,
      items: [
        { name: 'socks', priority: 1 },
        { name: 'book' },
        { name: 'mug', url: 'https://example.com/mug' },
      ],
    });

    await request(app.getHttpServer())
      .get(`/api/rooms/${room.id}/wishlist/me`)
      .set(withAuth(owner.accessToken))
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(wishlist);
      });

    await request(app.getHttpServer())
      .get(`/api/rooms/${room.id}/wishlist/me`)
      .set(
        withAuth(
          (await registerUser('other@santa.test', 'Other User')).accessToken,
        ),
      )
      .expect(404)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error.success).toBe(false);
        expect(error.statusCode).toBe(404);
        expect(error.message).toContain(
          `Wishlist for room ${room.id} and user `,
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(() => {
    delete process.env.MONGO_URL;
    delete process.env.JWT_SECRET;
  });
});
