import Fastify, { FastifyInstance, FastifyError } from 'fastify';
import { dbPlugin } from './plugins/db';
import { timingPlugin } from './plugins/timing';
import { configPlugin } from './plugins/config';
import { healthRoutes } from './routes/health';
import { notificationsRoutes } from './routes/notifications';

async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  app.register(dbPlugin);
  app.register(configPlugin);
  app.register(timingPlugin);

  app.register(healthRoutes);
  app.register(notificationsRoutes, { prefix: '/api/notifications' });

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

  return app;
}

export { buildApp };
