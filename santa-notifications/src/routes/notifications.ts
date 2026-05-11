import { FastifyInstance } from 'fastify';
import { NotFoundError } from '../errors';

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

const notificationTypeValues = ['room_invite', 'assignment', 'wishlist_update', 'system'] as const;

const idParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', pattern: '^\\d+$' },
  },
};

export default async function notificationRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            userId: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
    async (request) => {
      const { userId } = request.query as { userId?: string };

      if (!userId) {
        return notifications;
      }

      return notifications.filter((notification) => notification.userId === userId);
    }
  );

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamsSchema,
      },
    },
    async (request) => {
      const { id } = request.params as { id: string };
      const notificationId = Number(id);
      const notification = notifications.find((item) => item.id === notificationId);

      if (!notification) {
        throw new NotFoundError('Notification', id);
      }

      return notification;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['userId', 'type', 'message'],
          properties: {
            userId: { type: 'string', format: 'uuid' },
            type: { type: 'string', enum: [...notificationTypeValues] },
            message: { type: 'string', minLength: 1, maxLength: 500 },
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
      request.log.info(
        { notificationId: createdNotification.id, userId, type },
        'Notification created'
      );
      reply.code(201);
      return createdNotification;
    }
  );

  fastify.patch(
    '/:id/read',
    {
      schema: {
        params: idParamsSchema,
      },
    },
    async (request) => {
      const { id } = request.params as { id: string };
      const notificationId = Number(id);
      const notificationIndex = getNotificationIndexById(notificationId);

      if (notificationIndex === -1) {
        throw new NotFoundError('Notification', id);
      }

      const existingNotification = notifications[notificationIndex];

      if (!existingNotification) {
        throw new NotFoundError('Notification', id);
      }

      const updatedNotification: Notification = {
        ...existingNotification,
        read: true,
      };

      notifications[notificationIndex] = updatedNotification;
      request.log.info({ notificationId, read: true }, 'Notification marked as read');
      return updatedNotification;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const notificationId = Number(id);
      const notificationIndex = getNotificationIndexById(notificationId);

      if (notificationIndex === -1) {
        throw new NotFoundError('Notification', id);
      }

      notifications.splice(notificationIndex, 1);
      request.log.info({ notificationId }, 'Notification deleted');
      reply.code(204).send();
    }
  );
}
