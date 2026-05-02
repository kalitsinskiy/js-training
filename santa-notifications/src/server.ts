import Fastify from 'fastify';

export interface Notification {
  id: number;
  userId: string;
  type: string; // e.g. "room.created", "user.joined", "draw.completed"
  message: string;
  read: boolean;
  createdAt: string; // ISO timestamp
}

const notifications: Notification[] = [];
let nextId = 1;

export const server = Fastify({ logger: false });

server.get('/health', async () => {
  return { status: 'ok' };
});

server.get<{ Querystring: { userId?: string } }>('/api/notifications', async (request) => {
  const { userId } = request.query;

  if (!userId) {
    return notifications;
  }

  return notifications.filter((notification) => notification.userId === userId);
});

server.get<{ Params: { id: string } }>('/api/notifications/:id', async (request, reply) => {
  const id = parseInt(request.params.id, 10);
  const notification = notifications.find((n) => n.id === id);

  if (!notification) {
    reply.status(404);
    return { error: 'Notification not found' };
  }

  return notification;
});

server.post<{ Body: { userId: string; type: string; message: string } }>(
  '/api/notifications',
  {
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'type', 'message'],
        properties: {
          userId: { type: 'string' },
          type: { type: 'string' },
          message: { type: 'string' },
        },
        additionalProperties: false,
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            userId: { type: 'string' },
            type: { type: 'string' },
            message: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const { userId, type, message } = request.body;
    const newNotification = {
      id: nextId,
      userId,
      type,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    nextId++;
    notifications.push(newNotification);
    reply.status(201);

    return newNotification;
  }
);

server.patch<{ Params: { id: string } }>('/api/notifications/:id/read', async (request, reply) => {
  const id = parseInt(request.params.id, 10);
  const notification = notifications.find((n) => n.id === id);

  if (!notification) {
    reply.status(404);
    return { error: 'Notification not found' };
  }

  const index = notifications.indexOf(notification);

  notifications[index].read = true;

  reply.status(200);
  return notifications[index];
});

server.delete<{ Params: { id: string } }>('/api/notifications/:id', async (request, reply) => {
  const id = parseInt(request.params.id, 10);
  const notification = notifications.find((n) => n.id === id);

  if (!notification) {
    reply.status(404);
    return { error: 'Notification not found' };
  }

  const index = notifications.indexOf(notification);
  notifications.splice(index, 1);

  return reply.status(204).send();
});

if (require.main === module) {
  server.listen({ port: 3002, host: '0.0.0.0' }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log('Server listening on port 3002');
  });
}
