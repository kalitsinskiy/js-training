import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Connection, Types } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { startInMemoryMongo, stopInMemoryMongo } from './helpers/mongo';

describe('WishlistController (e2e)', () => {
  let app: NestFastifyApplication;
  let connection: Connection;

  beforeAll(async () => {
    await startInMemoryMongo();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
  });

  afterAll(async () => {
    await app.close();
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
  });

  const post = (url: string, payload: unknown) =>
    app.getHttpAdapter().getInstance().inject({ method: 'POST', url, payload });

  const get = (url: string) =>
    app.getHttpAdapter().getInstance().inject({ method: 'GET', url });

  describe('POST /rooms/:roomId/wishlist', () => {
    test('returns 200 with the wishlist on first set', async () => {
      const roomId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();

      const res = await post(`/rooms/${roomId}/wishlist`, {
        userId,
        items: [{ name: 'hat' }, { name: 'book' }, { name: 'cup' }],
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual({
        roomId,
        userId,
        items: [{ name: 'hat' }, { name: 'book' }, { name: 'cup' }],
      });
    });

    test('overwrites a previous wishlist for the same user', async () => {
      const roomId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();

      await post(`/rooms/${roomId}/wishlist`, { userId, items: [{ name: 'old' }] });
      const res = await post(`/rooms/${roomId}/wishlist`, {
        userId,
        items: [{ name: 'new' }],
      });

      expect(res.statusCode).toBe(200);
      expect(res.json().items).toEqual([{ name: 'new' }]);
    });
  });

  describe('POST /rooms/:roomId/wishlist — validation', () => {
    test('returns 400 when userId in the body is not a Mongo ObjectId', async () => {
      const res = await post(`/rooms/${new Types.ObjectId().toString()}/wishlist`, {
        userId: 'not-a-mongo-id',
        items: [{ name: 'x' }],
      });
      expect(res.statusCode).toBe(400);
    });

    test('returns 400 when items contains an empty name', async () => {
      const res = await post(`/rooms/${new Types.ObjectId().toString()}/wishlist`, {
        userId: new Types.ObjectId().toString(),
        items: [{ name: 'ok' }, { name: '' }],
      });
      expect(res.statusCode).toBe(400);
    });

    test('returns 400 when items is not an array', async () => {
      const res = await post(`/rooms/${new Types.ObjectId().toString()}/wishlist`, {
        userId: new Types.ObjectId().toString(),
        items: 'socks',
      });
      expect(res.statusCode).toBe(400);
    });

    test('returns 400 when an unknown field is sent', async () => {
      const res = await post(`/rooms/${new Types.ObjectId().toString()}/wishlist`, {
        userId: new Types.ObjectId().toString(),
        items: [{ name: 'x' }],
        public: true,
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /rooms/:roomId/wishlist/:userId', () => {
    test('returns 200 with the wishlist when one exists', async () => {
      const roomId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();
      await post(`/rooms/${roomId}/wishlist`, { userId, items: [{ name: 'mug' }] });

      const res = await get(`/rooms/${roomId}/wishlist/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual({ roomId, userId, items: [{ name: 'mug' }] });
    });

    test('returns 404 with the error envelope when no wishlist exists', async () => {
      const res = await get(`/rooms/${new Types.ObjectId().toString()}/wishlist/${new Types.ObjectId().toString()}`);

      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({
        success: false,
        statusCode: 404,
        message: expect.stringContaining('not found'),
        timestamp: expect.any(String),
      });
    });
  });
});
