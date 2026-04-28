import Fastify from 'fastify';

interface Notification {
  id: number;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const app = Fastify({ logger: true });

const notifications: Notification[] = [];
let nextId = 1;

app.get('/health', async () => {
  return { status: 'ok' };
});

// GET /api/notifications
app.get('/api/notifications', async (request) => {
  const { userId } = request.query as { userId?: string };
  if (userId) {
    return notifications.filter((n) => n.userId === userId);
  }
  return notifications;
});

// GET /api/notifications/:id
app.get('/api/notifications/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const notification = notifications.find((n) => n.id === Number(id));
  if (!notification) {
    reply.code(404);
    return { error: 'Notification not found' };
  }
  return notification;
});

// POST /api/notifications
app.post('/api/notifications', async (request, reply) => {
  const body = request.body as { userId?: string; type?: string; message?: string };
  if (!body.userId || typeof body.userId !== 'string' ||
      !body.type   || typeof body.type   !== 'string' ||
      !body.message || typeof body.message !== 'string') {
    reply.code(400);
    return { error: 'userId, type, and message are required strings' };
  }
  const notification: Notification = {
    id: nextId++,
    userId: body.userId,
    type: body.type,
    message: body.message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.push(notification);
  reply.code(201);
  return notification;
});

// PATCH /api/notifications/:id/read
app.patch('/api/notifications/:id/read', async (request, reply) => {
  const { id } = request.params as { id: string };
  const notification = notifications.find((n) => n.id === Number(id));
  if (!notification) {
    reply.code(404);
    return { error: 'Notification not found' };
  }
  notification.read = true;
  return notification;
});

// DELETE /api/notifications/:id
app.delete('/api/notifications/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const index = notifications.findIndex((n) => n.id === Number(id));
  if (index === -1) {
    reply.code(404);
    return { error: 'Notification not found' };
  }
  notifications.splice(index, 1);
  reply.code(204).send();
});

const start = async () => {
  try {
    await app.listen({ port: 3002, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
