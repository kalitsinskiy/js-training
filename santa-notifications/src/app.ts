import Fastify, { FastifyError } from 'fastify';
import configPlugin from './plugins/config';
import timingPlugin from './plugins/timing';
import healthRoutes from './routes/health';
import notificationRoutes from './routes/notifications';

export async function buildApp() {
  const app = Fastify({ logger: true });

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

  app.register(configPlugin);
  app.register(timingPlugin);
  app.register(healthRoutes);
  app.register(notificationRoutes, { prefix: '/api/notifications' });

  return app;
}
