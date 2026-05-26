import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import request from 'supertest';
import { RoomsModule } from './rooms.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema, UserDocument } from '../users/schemas/users.schema';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from '../../test/helpers/mongo';

describe('RoomsController (HTTP)', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';

    const uri = await startInMemoryMongo();
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        UsersModule,
        AuthModule,
        RoomsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    userModel = moduleRef.get<Model<UserDocument>>(getModelToken(User.name));
    await userModel.ensureIndexes();
  }, 30000);

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await userModel.db.collection('rooms').deleteMany({});
    await userModel.deleteMany({});

    const res = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'owner@example.com',
      password: 'SecretPass1',
      displayName: 'Owner',
    });

    token = res.body.accessToken;
    userId = res.body.id;
  });

  describe('POST /rooms', () => {
    test('201 + creates a room owned by the authenticated user', async () => {
      const res = await request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Office Secret Santa' })
        .expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        name: 'Office Secret Santa',
        ownerId: userId,
        code: expect.any(String),
        members: [userId],
        createdAt: expect.any(String),
      });
    });

    test('401 without Authorization header', async () => {
      await request(app.getHttpServer())
        .post('/rooms')
        .send({ name: 'Office Secret Santa' })
        .expect(401);
    });

    test('400 if `ownerId` is sent in the body (whitelist)', async () => {
      await request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Office Secret Santa', ownerId: 'someone-else' })
        .expect(400);
    });

    test('400 if name is too short', async () => {
      await request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'X' })
        .expect(400);
    });
  });

  describe('GET /rooms', () => {
    test('returns all rooms', async () => {
      await request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Room A' });
      await request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Room B' });

      const res = await request(app.getHttpServer())
        .get('/rooms')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveLength(2);
    });

    test('401 without token', async () => {
      await request(app.getHttpServer()).get('/rooms').expect(401);
    });
  });

  describe('GET /rooms/:id', () => {
    test('returns the room when it exists', async () => {
      const created = await request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Some Room' });

      const res = await request(app.getHttpServer())
        .get(`/rooms/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe(created.body.id);
    });

    test('404 when the room does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await request(app.getHttpServer())
        .get(`/rooms/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('POST /rooms/:code/join', () => {
    test('200 + adds the authenticated user to the room', async () => {
      // owner creates a room
      const created = await request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Open Room' });
      const code = created.body.code;

      // a second user registers and joins
      const joinerRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'joiner@example.com',
          password: 'SecretPass1',
          displayName: 'Joiner',
        });
      const joinerToken = joinerRes.body.accessToken;
      const joinerId = joinerRes.body.id;

      const res = await request(app.getHttpServer())
        .post(`/rooms/${code}/join`)
        .set('Authorization', `Bearer ${joinerToken}`)
        .expect(200);

      expect(res.body.members).toEqual(
        expect.arrayContaining([userId, joinerId]),
      );
    });

    test('404 when the code is unknown', async () => {
      await request(app.getHttpServer())
        .post('/rooms/ZZZZZZ/join')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    test('401 without token', async () => {
      await request(app.getHttpServer()).post('/rooms/ABC123/join').expect(401);
    });
  });
});
