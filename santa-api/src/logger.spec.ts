import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { startInMemoryMongo, stopInMemoryMongo } from '../test/helpers/mongo';

describe('AppModule - Pino Logger wiring', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.MONGO_URL = await startInMemoryMongo();
  }, 30000);

  afterAll(async () => {
    await mongoose.disconnect();
    await stopInMemoryMongo();
  }, 30000);

  test('Logger from nestjs-pino is available in the DI container', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const logger = moduleRef.get(Logger, { strict: false });

    expect(logger).toBeDefined();
    expect(typeof logger.log).toBe('function');

    await moduleRef.close();
  }, 30000);
});
