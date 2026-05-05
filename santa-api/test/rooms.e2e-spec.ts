import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';

describe('RoomsController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  const post = (url: string, payload: unknown) =>
    app.getHttpAdapter().getInstance().inject({ method: 'POST', url, payload });

  const get = (url: string) =>
    app.getHttpAdapter().getInstance().inject({ method: 'GET', url });

  describe('POST /rooms', () => {
    test('creates a room and returns 201 with the full shape', async () => {
      const res = await post('/rooms', {
        name: 'Test Room',
        ownerId: 'owner-1',
      });

      expect(res.statusCode).toBe(201);
      expect(res.json()).toEqual({
        id: expect.any(String),
        name: 'Test Room',
        ownerId: 'owner-1',
        code: expect.stringMatching(/^[A-Z0-9]{6}$/),
        members: ['owner-1'],
        createdAt: expect.any(String),
      });
    });
  });

  describe('GET /rooms', () => {
    test('returns 200 with an empty array when no rooms exist', async () => {
      const res = await get('/rooms');

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual([]);
    });

    test('returns every created room', async () => {
      await post('/rooms', { name: 'A', ownerId: 'owner-1' });
      await post('/rooms', { name: 'B', ownerId: 'owner-2' });

      const res = await get('/rooms');

      expect(res.statusCode).toBe(200);
      expect(res.json()).toHaveLength(2);
    });
  });

  describe('GET /rooms/:id', () => {
    test('returns 200 with the room when it exists', async () => {
      const created = (
        await post('/rooms', { name: 'A', ownerId: 'owner-1' })
      ).json();

      const res = await get(`/rooms/${created.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.json()).toMatchObject({
        id: created.id,
        name: 'A',
        ownerId: 'owner-1',
      });
    });

    test('returns 404 when the room does not exist', async () => {
      const res = await get('/rooms/does-not-exist');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /rooms/:code/join', () => {
    test('returns 200 (not 201) and adds the member', async () => {
      const created = (
        await post('/rooms', { name: 'A', ownerId: 'owner-1' })
      ).json();

      const res = await post(`/rooms/${created.code}/join`, {
        userId: 'user-2',
      });

      expect(res.statusCode).toBe(200);
      expect(res.json().members).toEqual(['owner-1', 'user-2']);
    });

    test('is idempotent — joining twice does not duplicate', async () => {
      const created = (
        await post('/rooms', { name: 'A', ownerId: 'owner-1' })
      ).json();

      await post(`/rooms/${created.code}/join`, { userId: 'user-2' });
      const res = await post(`/rooms/${created.code}/join`, {
        userId: 'user-2',
      });

      expect(res.statusCode).toBe(200);
      expect(res.json().members).toEqual(['owner-1', 'user-2']);
    });

    test('returns 404 when no room has that code', async () => {
      const res = await post('/rooms/ZZZZZZ/join', { userId: 'user-2' });
      expect(res.statusCode).toBe(404);
    });
  });
});
