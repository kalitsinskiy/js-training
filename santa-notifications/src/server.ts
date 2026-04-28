import { buildApp } from './app';

const app = buildApp();

async function start() {
  try {
    await app.ready();
    await app.listen({ port: app.config.port, host: '0.0.0.0' });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
