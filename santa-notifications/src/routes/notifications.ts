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

export default async function notificationRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, async (request) => {
    const { userId } = request.query as { userId?: string };
    return userId ? notifications.filter((n) => n.userId === userId) : notifications;
  });

  fastify.get('/:id', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string', pattern: '^\\d+$' } } },
    },
  }, async (request) => {
    const { id } = request.params as { id: string };
    const notification = notifications.find((n) => n.id === parseInt(id, 10));
    if (!notification) throw new NotFoundError('Notification', id);
    return notification;
  });

  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'type', 'message'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['room_invite', 'assignment', 'wishlist_update', 'system'] },
          message: { type: 'string', minLength: 1, maxLength: 500 },
        },
        additionalProperties: false,
      },
    },
  }, async (request, reply) => {
    const { userId, type, message } = request.body as { userId: string; type: string; message: string };
    const notification: Notification = {
      id: nextId++,
      userId,
      type,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.push(notification);
    reply.code(201);
    return notification;
  });

  fastify.patch('/:id/read', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string', pattern: '^\\d+$' } } },
    },
  }, async (request) => {
    const { id } = request.params as { id: string };
    const notification = notifications.find((n) => n.id === parseInt(id, 10));
    if (!notification) throw new NotFoundError('Notification', id);
    notification.read = true;
    return notification;
  });

  fastify.delete('/:id', {
    schema: {
      params: { type: 'object', properties: { id: { type: 'string', pattern: '^\\d+$' } } },
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const index = notifications.findIndex((n) => n.id === parseInt(id, 10));
    if (index === -1) throw new NotFoundError('Notification', id);
    notifications.splice(index, 1);
    reply.code(204).send();
  });
}
