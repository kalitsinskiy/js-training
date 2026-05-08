import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { Notification } from '../models/notification';

interface DbStore {
  notifications: Array<Notification>;
  nextId: number;
}

declare module 'fastify' {
  interface FastifyInstance {
    db: DbStore;
  }
}

async function dbPlugin(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  const store: DbStore = { notifications: [], nextId: 1 };

  // Decorate the Fastify instance with our "db"
  fastify.decorate('db', store);

  fastify.log.info('DB plugin loaded (in-memory store)');
}

const dbPluginWrapped = fp(dbPlugin, { name: 'db-plugin' });

export { DbStore, dbPluginWrapped as dbPlugin };
