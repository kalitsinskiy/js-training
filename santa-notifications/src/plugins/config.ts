import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';

interface AppConfig {
  port: number;
  env: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: AppConfig;
  }
}

async function configPlugin(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  const config: AppConfig = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3002,
    env: process.env.NODE_ENV ?? 'development',
  };

  fastify.decorate('config', config);
  fastify.log.info({ config }, 'Config plugin loaded');
}

const configPluginWrapped = fp(configPlugin, { name: 'config-plugin' });

export { AppConfig, configPluginWrapped as configPlugin };
