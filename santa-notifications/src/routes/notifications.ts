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

export default async function notificationRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request) => {
    const { userId } = request.query as { userId?: string };
    return userId ? notifications.filter((n) => n.userId === userId) : notifications;
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const notification = notifications.find((n) => n.id === parseInt(id, 10));
    if (!notification) {
      reply.code(404);
      return { error: 'Notification not found' };
    }
    return notification;
  });

  fastify.post('/', {
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

  fastify.patch('/:id/read', async (request, reply) => {
    const { id } = request.params as { id: string };
    const notification = notifications.find((n) => n.id === parseInt(id, 10));
    if (!notification) {
      reply.code(404);
      return { error: 'Notification not found' };
    }
    notification.read = true;
    return notification;
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const index = notifications.findIndex((n) => n.id === parseInt(id, 10));
    if (index === -1) {
      reply.code(404);
      return { error: 'Notification not found' };
    }
    notifications.splice(index, 1);
    reply.code(204).send();
  });
}
