import { FastifyInstance } from 'fastify';
import { buildApp } from '../app';

describe('notifications routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/notifications', () => {
    test('creates a notification and returns 201', async () => {
      const payload = { userId: 'user-123', type: 'room.created', message: 'Your room is ready' };
      const res = await app.inject({ method: 'POST', url: '/api/notifications', payload });

      expect(res.statusCode).toBe(201);

      const body = res.json();
      expect(body).toMatchObject(payload);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('createdAt');
      expect(body.read).toBe(false);
    });

    test('returns 400 when required fiedls are missing', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/notifications',
        payload: { userId: 'only-id' },
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/notifications', () => {
    test('returns [] when no notification exist', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/notifications' });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual([]);
    });
  });

  test('filters notifications by userId', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/notifications',
      payload: { userId: 'target', type: 't', message: 'm' },
    });
    await app.inject({
      method: 'POST',
      url: '/api/notifications',
      payload: { userId: 'other', type: 't', message: 'm' },
    });

    const res = await app.inject({
      method: 'GET',
      url: '/api/notifications',
      query: { userId: 'target' },
    });

    const list = res.json();
    expect(list).toHaveLength(1);
    expect(list[0].userId).toBe('target');
  });

  describe('GET /api/notifications/:id', () => {
    test('returns notification', async () => {
      const created = await app.inject({
        method: 'POST',
        url: '/api/notifications',
        payload: { userId: 'u1', type: 't', message: 'm' },
      });
      const { id } = created.json();

      const res = await app.inject({ method: 'GET', url: `/api/notifications/${id}` });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toMatchObject({ id, userId: 'u1', type: 't', message: 'm' });
    });

    test('returns 404 when not found', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/notifications/9999' });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/notificaitons/:id/read', () => {
    test('mark as read', async () => {
      const created = await app.inject({
        method: 'POST',
        url: '/api/notifications',
        payload: { userId: 'u1', type: 't', message: 'm' },
      });
      const { id } = created.json();

      const res = await app.inject({ method: 'PATCH', url: `/api/notifications/${id}/read` });
      expect(res.statusCode).toBe(200);
      expect(res.json().read).toBe(true);
    });

    test('returns 404 when not found', async () => {
      const res = await app.inject({ method: 'PATCH', url: '/api/notifications/9999/read' });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/notification/:id', () => {
    test('returns 204 and removes it', async () => {
      const created = await app.inject({
        method: 'POST',
        url: '/api/notifications',
        payload: { userId: 'u1', type: 't', message: 'm' },
      });
      const { id } = created.json();

      const del = await app.inject({ method: 'DELETE', url: `/api/notifications/${id}` });
      expect(del.statusCode).toBe(204);
      expect(del.payload).toBe('');

      const get = await app.inject({ method: 'GET', url: `/api/notifications/${id}` });
      expect(get.statusCode).toBe(404);
    });

    test('returns 404 when not found', async () => {
      const res = await app.inject({ method: 'DELETE', url: '/api/notifications/9999' });
      expect(res.statusCode).toBe(404);
    });
  });
});
