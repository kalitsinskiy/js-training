import Fastify from 'fastify';

const app = Fastify({ logger: true });

interface Notification {
  id: number;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationInput {
  userId?: unknown;
  type?: unknown;
  message?: unknown;
}

const notifications: Notification[] = [];
let nextId = 1;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getNotificationIndexById(id: number) {
  return notifications.findIndex((notification) => notification.id === id);
}

app.get('/health', async () => {
  return { status: 'ok' };
});

//GET /api/notifications?userId=abc - returns all notification related to user with id

app.get('/api/notifications', async (request) => {
  const { userId } = request.query as { userId?: string };

  if (!userId) {
    return notifications;
  }

  return notifications.filter((notification) => notification.userId === userId);
});

app.get('/api/notifications/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const notificationId = Number(id);
  const notification = notifications.find((item) => item.id === notificationId);

  if (!notification) {
    reply.code(404);
    return { error: 'Notification not found' };
  }

  return notification;
});

app.post('/api/notifications', async (request, reply) => {
  const body = request.body as NotificationInput;
  const { userId, type, message } = body;

  if (!isNonEmptyString(userId) || !isNonEmptyString(type) || !isNonEmptyString(message)) {
    reply.code(400);
    return { error: 'userId, type, and message must all be non-empty strings' };
  }

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
});

app.patch('/api/notifications/:id/read', async (request, reply) => {
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

app.delete('/api/notifications/:id', async (request, reply) => {
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

async function start() {
  try {
    await app.listen({ port: 3002, host: '0.0.0.0' });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
