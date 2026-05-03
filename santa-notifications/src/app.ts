import Fastify, { FastifyInstance, FastifyError } from 'fastify';
import healthRoutes from '../routes/health';
import configPlugin from '../plugins/config';
import timingPlugin from '../plugins/timing';
import notificationRoutes from '../routes/notifications';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error.validation) {
      reply.code(400).send({
        error: 'Validation Error',
        details: error.validation.map((v: { message?: string }) => v.message),
      });
      return;
    }

    request.log.error(error);
    reply.code(error.statusCode ?? 500).send({
      error: error.message ?? 'Internal Server Error',
    });
  });

  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      error: `Route ${request.method} ${request.url} not found`,
    });
  });

  await app.register(configPlugin);
  await app.register(timingPlugin);
  await app.register(healthRoutes);
  await app.register(notificationRoutes, { prefix: '/api/notifications' });

  return app;
}
