import { FastifyPluginAsync } from 'fastify';
import { NotFoundError } from '../src/errors';
import { NotificationModel } from '../src/models/notification';

const notificationRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: { userId?: string } }>(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              pattern: '^[a-fA-F0-9]{24}$',
            },
          },
          additionalProperties: false,
        },
      },
    },
    async (request) => {
      const filter = request.query.userId ? { userId: request.query.userId } : {};
      return NotificationModel.find(filter).sort({ createdAt: -1 }).lean();
    }
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
          },
        },
      },
    },
    async (request) => {
      const found = await NotificationModel.findById(request.params.id).lean();
      if (!found) throw new NotFoundError('Notification', request.params.id);
      return found;
    }
  );

  fastify.post<{
    Body: {
      userId: string;
      type: 'room_invite' | 'assignment' | 'wishlist_update' | 'system';
      message: string;
    };
  }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['userId', 'type', 'message'],
          properties: {
            userId: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
            type: {
              type: 'string',
              enum: ['room_invite', 'assignment', 'wishlist_update', 'system'],
            },
            message: { type: 'string', minLength: 1, maxLength: 50 },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const created = await NotificationModel.create(request.body);
      reply.status(201);
      return created.toObject();
    }
  );

  fastify.patch<{ Params: { id: string } }>(
    '/:id/read',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
          },
        },
      },
    },
    async (request) => {
      const updated = await NotificationModel.findByIdAndUpdate(
        request.params.id,
        { read: true },
        { new: true }
      ).lean();
      if (!updated) throw new NotFoundError('Notification', request.params.id);
      return updated;
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
          },
        },
      },
    },
    async (request, reply) => {
      const deleted = await NotificationModel.findByIdAndDelete(request.params.id);
      if (!deleted) throw new NotFoundError('Notification', request.params.id);
      return reply.status(204).send();
    }
  );
};

export default notificationRoutes;
