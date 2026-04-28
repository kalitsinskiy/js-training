import { FastifyInstance } from 'fastify';

interface Notification {
  id: number;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const notifications: Notification[] = [];
let nextId = 1;

function getNotificationIndexById(id: number) {
  return notifications.findIndex((notification) => notification.id === id);
}

export default async function notificationRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request) => {
    const { userId } = request.query as { userId?: string };

    if (!userId) {
      return notifications;
    }

    return notifications.filter((notification) => notification.userId === userId);
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const notificationId = Number(id);
    const notification = notifications.find((item) => item.id === notificationId);

    if (!notification) {
      reply.code(404);
      return { error: 'Notification not found' };
    }

    return notification;
  });

  fastify.post(
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
      const { userId, type, message } = request.body as {
        userId: string;
        type: string;
        message: string;
      };

      const createdNotification: Notification = {
        id: nextId++,
        userId,
        type,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      };

      notifications.push(createdNotification);
      reply.code(201);
      return createdNotification;
    }
  );

  fastify.patch('/:id/read', async (request, reply) => {
    const { id } = request.params as { id: string };
    const notificationId = Number(id);
    const notificationIndex = getNotificationIndexById(notificationId);

    if (notificationIndex === -1) {
      reply.code(404);
      return { error: 'Notification not found' };
    }

    const existingNotification = notifications[notificationIndex];

    if (!existingNotification) {
      reply.code(404);
      return { error: 'Notification not found' };
    }

    const updatedNotification: Notification = {
      ...existingNotification,
      read: true,
    };

    notifications[notificationIndex] = updatedNotification;
    return updatedNotification;
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const notificationId = Number(id);
    const notificationIndex = getNotificationIndexById(notificationId);

    if (notificationIndex === -1) {
      reply.code(404);
      return { error: 'Notification not found' };
    }

    notifications.splice(notificationIndex, 1);
    reply.code(204).send();
  });
}
