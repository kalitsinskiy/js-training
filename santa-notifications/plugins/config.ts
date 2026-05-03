import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    config: { port: number; env: string };
  }
}

async function configPlugin(fastify: FastifyInstance) {
  fastify.decorate('config', {
    port: Number(process.env.PORT) || 3002,
    env: process.env.NODE_ENV ?? 'development',
  });
}

export default fp(configPlugin, { name: 'config' });
