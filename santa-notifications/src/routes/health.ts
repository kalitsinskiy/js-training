import { FastifyInstance, FastifyPluginOptions } from 'fastify';

async function healthRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });
}

export { healthRoutes };
