import { FastifyInstance } from 'fastify';
import { NotFoundError } from '../errors';
import { NotificationModel } from '../models/notification';

export default async function notificationRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
          },
        },
      },
    },
    async (request) => {
      const { userId } = request.query as { userId?: string };
      const query = userId ? { userId } : {};
      return NotificationModel.find(query).sort({ createdAt: -1 });
    },
  );

  fastify.get(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: { id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' } },
        },
      },
    },
    async (request) => {
      const { id } = request.params as { id: string };
      const notification = await NotificationModel.findById(id);
      if (!notification) throw new NotFoundError('Notification', id);
      return notification;
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['userId', 'type', 'message'],
          properties: {
            userId: { type: 'string' },
            type: {
              type: 'string',
              enum: ['room_invite', 'assignment', 'wishlist_update', 'system'],
            },
            message: { type: 'string', minLength: 1, maxLength: 500 },
            payload: {},
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { userId, type, message, payload } = request.body as {
        userId: string;
        type: 'room_invite' | 'assignment' | 'wishlist_update' | 'system';
        message: string;
        payload?: unknown;
      };
      const notification = await NotificationModel.create({
        userId,
        type,
        message,
        payload,
      });
      reply.code(201);
      return notification;
    },
  );

  fastify.patch(
    '/:id/read',
    {
      schema: {
        params: {
          type: 'object',
          properties: { id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' } },
        },
      },
    },
    async (request) => {
      const { id } = request.params as { id: string };
      const notification = await NotificationModel.findByIdAndUpdate(
        id,
        { read: true },
        { new: true },
      );
      if (!notification) throw new NotFoundError('Notification', id);
      return notification;
    },
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: { id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' } },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const notification = await NotificationModel.findByIdAndDelete(id);
      if (!notification) throw new NotFoundError('Notification', id);
      reply.code(204).send();
    },
  );
}
