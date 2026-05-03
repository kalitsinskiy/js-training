export {};
// ============================================
// FASTIFY PLUGIN ARCHITECTURE Exercise
// ============================================
// Run: npx ts-node src/04-backend/lessons/03-fastify/exercises/plugin-server.ts
//
// Build a Bookmarks API using Fastify's plugin system.
// This exercise practices: plugins, fp(), decorators, hooks, encapsulation, JSON Schema.

import Fastify, {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';

// --- Data model ---
interface Bookmark {
  id: number;
  url: string;
  title: string;
  tags: string[];
  createdAt: string;
}

// TODO 1: Declaration merging
declare module 'fastify' {
  interface FastifyInstance {
    store: { bookmarks: Bookmark[]; nextId: number };
    appConfig: { port: number; env: string };
  }
  interface FastifyRequest {
    startTime: number;
  }
}

// TODO 2: Config plugin (wrap with fp)
async function configPlugin(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.decorate('appConfig', { port: 3000, env: process.env['NODE_ENV'] ?? 'development' });
}
export const configPluginWrapped = fp(configPlugin, { name: 'config' });

// TODO 3: Database plugin (wrap with fp)
async function dbPlugin(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.decorate('store', { bookmarks: [], nextId: 1 });
}
export const dbPluginWrapped = fp(dbPlugin, { name: 'db' });

// TODO 4: Timing plugin (wrap with fp)
async function timingPlugin(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.decorateRequest('startTime', 0);
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    request.startTime = Date.now();
  });
  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.header('X-Response-Time', `${Date.now() - request.startTime}ms`);
  });
}
export const timingPluginWrapped = fp(timingPlugin, { name: 'timing' });

// TODO 5: Request counter plugin (NOT wrapped with fp — encapsulated)
async function statsPlugin(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  let count = 0;
  fastify.addHook('onRequest', async () => {
    count++;
  });
  fastify.get('/stats', async () => ({ requestCount: count }));
}

// TODO 6: Bookmark routes plugin (NOT wrapped with fp — encapsulated)
async function bookmarkRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  const { store } = fastify;

  fastify.get<{ Querystring: { tag?: string } }>(
    '/',
    async (request: FastifyRequest<{ Querystring: { tag?: string } }>) => {
      const tag = request.query['tag'];
      if (tag) {
        return store.bookmarks.filter((b) => b.tags.includes(tag));
      }
      return store.bookmarks;
    }
  );

  fastify.get<{ Params: { id: string } }>(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const id = parseInt(request.params['id'], 10);
      const bookmark = store.bookmarks.find((b) => b.id === id);
      if (!bookmark) return reply.status(404).send({ error: 'Bookmark not found' });
      return bookmark;
    }
  );

  fastify.post<{ Body: { url: string; title: string; tags: string[] } }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['url', 'title', 'tags'],
          properties: {
            url: { type: 'string', format: 'uri' },
            title: { type: 'string', minLength: 1 },
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    async (request, reply) => {
      const { url, title, tags } = request.body;
      const bookmark: Bookmark = {
        id: store.nextId++,
        url,
        title,
        tags,
        createdAt: new Date().toISOString(),
      };
      store.bookmarks.push(bookmark);
      return reply.status(201).send(bookmark);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const id = parseInt(request.params['id'], 10);
      const idx = store.bookmarks.findIndex((b) => b.id === id);
      if (idx === -1) return reply.status(404).send({ error: 'Bookmark not found' });
      store.bookmarks.splice(idx, 1);
      return reply.status(204).send();
    }
  );
}

// TODO 7: Assemble and start
const app = Fastify({ logger: true });

app.register(configPluginWrapped);
app.register(dbPluginWrapped);
app.register(timingPluginWrapped);
app.register(statsPlugin);
app.register(bookmarkRoutes, { prefix: '/api/bookmarks' });
app.get('/health', async () => ({ status: 'ok' }));

app
  .ready()
  .then(() => {
    console.log('Has store?', app.hasDecorator('store')); // true
    console.log('Has appConfig?', app.hasDecorator('appConfig')); // true
  })
  .catch((err: unknown) => {
    app.log.error(err);
  });

app.listen({ port: 3000 }, (err: Error | null) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
