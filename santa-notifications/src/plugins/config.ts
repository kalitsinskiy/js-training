import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    config: { port: number; env: string };
  }
}

async function configPlugin(fastify: FastifyInstance) {
  const port = parseInt(process.env.PORT ?? '3002', 10);
  const env = process.env.NODE_ENV ?? 'development';
  fastify.decorate('config', { port, env });
}

export default fp(configPlugin, { name: 'config' });
