import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Notification, NotificationDTO } from '../models/notification';

async function notificationsRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  const { db } = fastify;

  fastify.get<{
    Querystring: { userId?: string };
  }>('/', async (request) => {
    const { userId } = request.query;
    if (userId) {
      const filteredNotifications = db.notifications.filter((n) => n.userId === userId);
      return filteredNotifications;
    }
    return db.notifications;
  });

  fastify.get<{
    Params: { id: string };
  }>('/:id', async (request, reply) => {
    const { id } = request.params;
    const idNum = parseInt(id, 10);
    const notification = db.notifications.find((n) => n.id === idNum);

    if (!notification) {
      reply.code(404);
      return { error: 'Notification not found' };
    }

    return notification;
  });

  fastify.post<{
    Body: NotificationDTO;
  }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['userId', 'type', 'message'],
          properties: {
            userId: { type: 'string', minLength: 1 },
            type: { type: 'string', minLength: 1 },
            message: { type: 'string', minLength: 1 },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const data = request.body;
      const notification: Notification = {
        id: db.nextId++,
        read: false,
        createdAt: new Date().toISOString(),
        userId: data.userId,
        type: data.type,
        message: data.message,
      };

      db.notifications.push(notification);

      reply.code(201);
      return notification;
    }
  );

  fastify.patch<{
    Params: { id: string };
  }>('/:id/read', async (request, reply) => {
    const { id } = request.params;
    const idNum = parseInt(id, 10);
    const notificationIdx = db.notifications.findIndex((n) => n.id === idNum);

    if (notificationIdx !== -1) {
      db.notifications[notificationIdx].read = true;
      return db.notifications[notificationIdx];
    }

    reply.code(404);
  });

  fastify.delete<{
    Params: { id: string };
  }>('/:id', async (request, reply) => {
    const { id } = request.params;
    const idNum = parseInt(id, 10);
    const notificationIdx = db.notifications.findIndex((n) => n.id === idNum);

    if (notificationIdx !== -1) {
      db.notifications.splice(notificationIdx, 1);
      reply.code(204);
    } else {
      reply.code(404);
    }
  });
}

export { notificationsRoutes };
