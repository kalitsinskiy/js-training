import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { ThrottlerStorage } from '@nestjs/throttler';
import { AppModule } from '../src/app.module';
import { startInMemoryMongo, stopInMemoryMongo } from './helpers/mongo';

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication;
  let connection: Connection;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';

    await startInMemoryMongo();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Replace the throttler's storage so totalHits is always 0 -> never trips.
      // overrideGuard / overrideProvider(APP_GUARD) don't reliably intercept
      // a guard registered as a multi-provider under APP_GUARD; replacing the
      // storage backing the guard is the simpler, dependency-version-independent
      // hammer.
      .overrideProvider(ThrottlerStorage)
      .useValue({
        increment: async () => ({
          totalHits: 0,
          timeToExpire: 0,
          isBlocked: false,
          timeToBlockExpire: 0,
        }),
      })
      .compile();

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

  const post = (url: string, payload: unknown) =>
    app.getHttpAdapter().getInstance().inject({ method: 'POST', url, payload });

  const validRegisterBody = {
    email: 'alice@example.com',
    password: 'SecretPass1',
    displayName: 'Alice',
  };

  describe('POST /auth/register', () => {
    test('returns 201 with { id, email, displayName, accessToken }', async () => {
      const res = await post('/auth/register', validRegisterBody);

      expect(res.statusCode).toBe(201);

      const body = res.json();

      expect(body).toEqual({
        id: expect.any(String),
        email: 'alice@example.com',
        displayName: 'Alice',
        accessToken: expect.any(String),
      });
      expect(body.accessToken.split('.')).toHaveLength(3);
    });

    test('lowercase the email before stroring', async () => {
      const res = await post('/auth/register', {
        ...validRegisterBody,
        email: 'ALICE@Example.com',
      });

      expect(res.statusCode).toBe(201);
      expect(res.json().email).toBe('alice@example.com');
    });

    test.each([
      ['email missing', { password: 'SecretPass1', displayName: 'Alice' }],
      ['email invalid format', { ...validRegisterBody, email: 'not-an-email' }],
      ['password missing', { email: 'a@b.com', displayName: 'Alice' }],
      ['password too short', { ...validRegisterBody, password: 'short' }],
      ['displayName missing', { email: 'a@b.com', password: 'SecretPass1' }],
      [
        'displayName too long',
        { ...validRegisterBody, displayName: 'x'.repeat(51) },
      ],
      [
        'unknown field rejected by whitelist',
        { ...validRegisterBody, role: 'admin' },
      ],
    ])('returns 400 when %s', async (_label, payload) => {
      const res = await post('/auth/register', payload);

      expect(res.statusCode).toBe(400);
    });

    test('returns 409 on duplicate email', async () => {
      const first = await post('/auth/register', validRegisterBody);
      expect(first.statusCode).toBe(201);

      const second = await post('/auth/register', validRegisterBody);
      expect(second.statusCode).toBe(409);
    });

    test('different-case duplicate as conflict', async () => {
      await post('/auth/register', validRegisterBody);
      const res = await post('/auth/register', {
        ...validRegisterBody,
        email: 'ALICE@Example.com',
      });

      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await post('/auth/register', validRegisterBody);
    });

    test('returns 200 + accessToken on valid credentials', async () => {
      const res = await post('/auth/login', {
        email: 'alice@example.com',
        password: 'SecretPass1',
      });

      expect(res.statusCode).toBe(200);

      const body = res.json();

      expect(body).toEqual({
        id: expect.any(String),
        email: 'alice@example.com',
        displayName: 'Alice',
        accessToken: expect.any(String),
      });
      expect(body.accessToken.split('.')).toHaveLength(3);
    });

    test('accepts email of any case', async () => {
      const res = await post('/auth/login', {
        email: 'ALICE@example.com',
        password: 'SecretPass1',
      });

      expect(res.statusCode).toBe(200);
      expect(res.json().email).toBe('alice@example.com');
    });

    test('returns 401 on wrong password', async () => {
      const res = await post('/auth/login', {
        email: 'alice@exmaple.com',
        password: 'WrongPass1',
      });

      expect(res.statusCode).toBe(401);
    });

    test('returns 401 on unknown email', async () => {
      const res = await post('/auth/login', {
        email: 'unknown@example.com',
        password: 'SecretPass1',
      });

      expect(res.statusCode).toBe(401);
    });

    test('uses the SAME generic messages for wrong password and unknown email', async () => {
      const wrongPass = await post('/auth/login', {
        email: 'alice@example.com',
        password: 'WrongPass1',
      });

      const unknownEmail = await post('/auth/login', {
        email: 'unknown@example.com',
        password: 'SecretPass1',
      });

      expect(wrongPass.statusCode).toBe(401);
      expect(unknownEmail.statusCode).toBe(401);
      expect(wrongPass.json().message).toEqual(unknownEmail.json().message);
    });

    test('return 400 when the body fails validation (missing password)', async () => {
      const res = await post('/auth/login', { email: 'alice@example.com' });

      expect(res.statusCode).toBe(400);
    });
  });
});
