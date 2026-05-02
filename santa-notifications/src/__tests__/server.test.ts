import { server } from '../server';

describe('santa-notification server in tests', () => {
  afterAll(async () => {
    await server.close();
  });

  describe('GET /health', () => {
    test('should return ok status', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ status: 'ok' });
    });
  });

  describe('GET unknown', () => {
    test('the unknown should retur 404', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/non-existing-url',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /api/notifications', () => {
    test('should create a new notification and return 201', async () => {
      const payload = {
        userId: 'user-123',
        type: 'room.created',
        message: 'Your room is ready!',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/api/notifications',
        payload,
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body).toMatchObject(payload);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('createdAt');
      expect(body.read).toBeFalsy();
    });

    test('should return 400 if required fields are missing', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/notifications',
        payload: { userId: 'only-id' },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/notifications', () => {
    test('should return empty array if 0 notifications', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/notifications',
        query: { userId: '3' },
      });

      const notifications = response.json();
      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications).toHaveLength(0);
    });

    test('should filter notifications by userId', async () => {
      await server.inject({
        method: 'POST',
        url: '/api/notifications',
        payload: { userId: 'target-user', type: 'test', message: 'hello' },
      });

      const response = await server.inject({
        method: 'GET',
        url: '/api/notifications',
        query: { userId: 'target-user' },
      });

      const notifications = response.json();
      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.every((n: any) => n.userId === 'target-user')).toBe(true);
    });

    test('should return single notification /:id', async () => {
      const postRes = await server.inject({
        method: 'POST',
        url: '/api/notifications',
        payload: { userId: 'u1', type: 't', message: 'm' },
      });
      const id = postRes.json().id;

      const response = await server.inject({
        method: 'GET',
        url: `/api/notifications/${id}`,
      });
      const notification = response.json();

      expect(notification).toMatchObject({
        id: expect.any(Number),
        userId: 'u1',
        type: 't',
        message: 'm',
        createdAt: expect.any(String),
      });
    });

    test('should return 404 for nont-existing single notification /:id', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/notifications/9999',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    test('should mark notification as read', async () => {
      const postRes = await server.inject({
        method: 'POST',
        url: '/api/notifications',
        payload: { userId: 'u1', type: 't', message: 'm' },
      });
      const createdId = postRes.json().id;

      const response = await server.inject({
        method: 'PATCH',
        url: `/api/notifications/${createdId}/read`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().read).toBe(true);
    });

    test('should return 404 for non-existing notification', async () => {
      const response = await server.inject({
        method: 'PATCH',
        url: '/api/notifications/9999/read',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    test('should delete notification and return 204', async () => {
      const postRes = await server.inject({
        method: 'POST',
        url: '/api/notifications',
        payload: { userId: 'u1', type: 't', message: 'm' },
      });
      const id = postRes.json().id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/api/notifications/${id}`,
      });

      expect(response.statusCode).toBe(204);
      expect(response.payload).toBe('');
    });

    test('should return 404 for non-existing notification', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/api/notifications/9999',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
