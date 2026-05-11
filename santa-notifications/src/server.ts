// Entry point — assembles the app and starts listening.
// All routes and plugins live in app.ts, plugins/, and routes/.
import { buildApp } from './app';

// Legacy inline implementation (kept for reference, now moved to routes/ and plugins/):
// import Fastify from 'fastify';
//
// interface Notification {
//   id: number;
//   userId: string;
//   type: string;
//   message: string;
//   read: boolean;
//   createdAt: string;
// }
//
// const app = Fastify({ logger: true });
// const notifications: Notification[] = [];
// let nextId = 1;
//
// app.get('/health', async () => { return { status: 'ok' }; });
//
// (all other routes moved to routes/notifications.ts)

const start = async () => {
  const app = await buildApp();
  try {
    await app.listen({ port: 3002, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
