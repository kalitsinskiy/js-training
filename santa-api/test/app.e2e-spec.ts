import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './../src/app.module';

describe('Santa API (e2e)', () => {
  let app: NestFastifyApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  // Verifies the default root route still responds with the Nest scaffold text.
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // Exercises the happy path: create two users, create a room, fetch it back,
  // and join the second user by room code.
  it('creates users and rooms, lists them, and joins by code', async () => {
    // Create the room owner and the member that will join later.
    const ownerResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Owner Participant', email: 'owner@santa.test' })
      .expect(201);

    const memberResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Helper Participant', email: 'helper@santa.test' })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/users/${ownerResponse.body.id}`)
      .expect(200)
      .expect(ownerResponse.body);

    // Create a room owned by the first user and confirm the generated shape.
    const roomResponse = await request(app.getHttpServer())
      .post('/rooms')
      .send({
        name: 'North Pole Ops',
        ownerId: ownerResponse.body.id,
      })
      .expect(201);

    expect(roomResponse.body).toMatchObject({
      name: 'North Pole Ops',
      ownerId: ownerResponse.body.id,
      members: [ownerResponse.body.id],
    });
    expect(roomResponse.body.code).toHaveLength(6);

    // Verify both the collection endpoint and the single-room endpoint.
    await request(app.getHttpServer())
      .get('/rooms')
      .expect(200)
      .expect([roomResponse.body]);

    await request(app.getHttpServer())
      .get(`/rooms/${roomResponse.body.id}`)
      .expect(200)
      .expect(roomResponse.body);

    // Join by code and confirm the new member is appended to the room.
    const joinedRoomResponse = await request(app.getHttpServer())
      .post(`/rooms/${roomResponse.body.code}/join`)
      .send({ userId: memberResponse.body.id })
      .expect(201);

    expect(joinedRoomResponse.body.members).toEqual([
      ownerResponse.body.id,
      memberResponse.body.id,
    ]);
  });

  // Confirms the API returns 404 when requested resources do not exist.
  it('returns 404 for missing users and rooms', async () => {
    await request(app.getHttpServer()).get('/users/missing-user').expect(404);
    await request(app.getHttpServer()).get('/rooms/missing-room').expect(404);
    await request(app.getHttpServer())
      .post('/rooms/MISSING/join')
      .send({ userId: 'missing-user' })
      .expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
