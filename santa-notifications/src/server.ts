import { buildApp } from './app';

(async () => {
  const app = await buildApp();
  const { config } = app;
  const port = config.port || 3000;

  try {
    await app.listen({ port });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
