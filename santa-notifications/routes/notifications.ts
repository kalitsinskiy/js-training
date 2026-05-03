import { FastifyPluginAsync } from 'fastify';

interface Notificaiton {
  id: number;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const notificationRoutes: FastifyPluginAsync = async (fastify) => {
  const notifications: Notificaiton[] = [];
  let nextId = 1;

  fastify.get<{ Querystring: { userId?: string } }>('/', async (request) => {
    const { userId } = request.query;

    if (!userId) return notifications;

    return notifications.filter((n) => n.userId === userId);
  });

  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const found = notifications.find((n) => n.id === id);

    if (!found) {
      reply.status(404);
      return { error: 'Notification not found' };
    }

    return found;
  });

  fastify.post<{ Body: { userId: string; type: string; message: string } }>(
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
      const { userId, type, message } = request.body;
      const created: Notificaiton = {
        id: nextId++,
        userId,
        type,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      };

      notifications.push(created);
      reply.status(201);
      return created;
    }
  );

  fastify.patch<{ Params: { id: string } }>('/:id/read', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const found = notifications.find((n) => n.id === id);

    if (!found) {
      reply.status(404);
      return { error: 'Notification not found' };
    }

    found.read = true;
    return found;
  });

  fastify.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const index = notifications.findIndex((n) => n.id === id);

    if (index === -1) {
      reply.status(404);
      return { error: 'Notification not found' };
    }

    notifications.splice(index, 1);
    return reply.status(204).send();
  });
};

export default notificationRoutes;
