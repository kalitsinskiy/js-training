import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { startInMemoryMongo, stopInMemoryMongo } from './helpers/mongo';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  let connection: Connection;

  beforeAll(async () => {
    await startInMemoryMongo();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    connection = app.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    await app.close();
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
  });

  describe('GET /health', () => {
    test('returns 200 with { status: "ok" }', async () => {
      const res = await app.getHttpAdapter().getInstance().inject({
        method: 'GET',
        url: '/health',
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual({ status: 'ok' });
    });
  });

  describe('unknown routes', () => {
    test('returns 404', async () => {
      const res = await app.getHttpAdapter().getInstance().inject({
        method: 'GET',
        url: '/nonexistent',
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
