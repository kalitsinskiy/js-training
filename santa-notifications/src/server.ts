import Fastify, { FastifyBaseLogger, FastifyRequest, FastifySchema, FastifyTypeProviderDefault, RouteGenericInterface } from 'fastify';
import { ResolveFastifyRequestType } from 'fastify/types/type-provider';
import { Server, IncomingMessage, ServerResponse } from 'node:http';

interface Notification {
  id: number;
  userId: string;
  type: string;       // e.g. "room.created", "user.joined", "draw.completed"
  message: string;
  read: boolean;
  createdAt: string;  // ISO timestamp
}
type NotificationDTO = Pick<Notification, 'userId' | 'type' | 'message'>;
const schema = {
  body: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      type: { type: 'string' },
      message: { type: 'string' }
    },
    required: ['userId', 'type', 'message']
  }
};
const baseAddress = '/api/notifications';
const notifications: Notification[] = [];
let nextId = 1;

function readId
<T extends RouteGenericInterface>
(request: FastifyRequest<T>): number {
  const { id: idStr } = request.params as { id: string; };
  const id = parseInt(idStr);
  return id;
}

const server = Fastify({ logger: true });

server.get('/health', async () => {
  return { status: 'ok' };
});

server.get(baseAddress, async (request) => {
  const query = request.query as { userId?: string };
  const userId = query?.userId;
  if (userId) {
    const filteredNotifications: Notification[] =
      notifications.filter((n) => n.userId === userId);
    return filteredNotifications;
  }
  return notifications;
});

server.get(baseAddress + '/:id', async (request, reply) => {
  const id = readId(request);
  const notification = notifications.find(n => n.id === id);

  if (notification) {
    return notification;
  } else {
    reply
      .code(404)
      .send({error: 'Notification not found'});
  }
});

server.post(baseAddress, {schema}, async (request, reply) => {
  const data = request.body as NotificationDTO;
  const notification: Notification = {
    id: nextId++,
    read: false,
    createdAt: new Date().toISOString(),
    userId: data.userId,
    type: data.type,
    message: data.message
  };

  notifications.push(notification);

  reply
    .code(201)
    .send(notification);
});

server.patch(baseAddress + '/:id/read', async (request, reply) => {
  const id = readId(request);
  const notificationIdx = notifications.findIndex(n => n.id === id);

  if (notificationIdx === -1) {
    reply.code(404);
  } else {
    notifications[notificationIdx].read = true;
    return notifications[notificationIdx];
  }
});

server.delete(baseAddress + '/:id', async (request, reply) => {
  const id = readId(request);
  const notificationIdx = notifications.findIndex(n => n.id === id);

  if (notificationIdx === -1) {
    reply.code(404);
  } else {
    notifications.splice(notificationIdx, 1);
    reply.code(204);
  }
});

void (async () => {
  await server.listen({ port: 3002, host: '0.0.0.0' });
})();

