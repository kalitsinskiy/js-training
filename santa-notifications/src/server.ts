import { buildApp } from './app';
import { connectDb } from './db';

const start = async () => {
  const app = await buildApp();
  try {
    await connectDb();
    app.log.info('Connected to MongoDB');
    await app.listen({ port: app.config.port, host: '0.0.0.0' });
  } catch (error) {
    app.log.error(error, 'Failed to start server');
    process.exit(1);
  }
};

start();
