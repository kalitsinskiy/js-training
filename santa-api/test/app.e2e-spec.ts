import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/configure-app';

type ErrorBody = {
  success: boolean;
  statusCode: number;
  message: string | string[];
  timestamp: string;
};

type UserBody = {
  id: string;
  name: string;
  email: string;
};

type RoomBody = {
  id: string;
  name: string;
  ownerId: string;
  code: string;
  members: string[];
};

type WishlistBody = {
  roomId: string;
  userId: string;
  items: string[];
};

describe('Santa API (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    configureApp(app);
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
    const owner = ownerResponse.body as UserBody;

    const memberResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Helper Participant', email: 'helper@santa.test' })
      .expect(201);
    const member = memberResponse.body as UserBody;

    await request(app.getHttpServer())
      .get(`/users/${owner.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(owner);
      });

    // Create a room owned by the first user and confirm the generated shape.
    const roomResponse = await request(app.getHttpServer())
      .post('/rooms')
      .send({
        name: 'North Pole Ops',
        ownerId: owner.id,
      })
      .expect(201);
    const room = roomResponse.body as RoomBody;

    expect(room).toMatchObject({
      name: 'North Pole Ops',
      ownerId: owner.id,
      members: [owner.id],
    });
    expect(room.code).toHaveLength(6);

    // Verify both the collection endpoint and the single-room endpoint.
    await request(app.getHttpServer()).get('/rooms').expect(200).expect([room]);

    await request(app.getHttpServer())
      .get(`/rooms/${room.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(room);
      });

    // Join by code and confirm the new member is appended to the room.
    const joinedRoomResponse = await request(app.getHttpServer())
      .post(`/rooms/${room.code}/join`)
      .send({ userId: member.id })
      .expect(201);
    const joinedRoom = joinedRoomResponse.body as RoomBody;

    expect(joinedRoom.members).toEqual([owner.id, member.id]);
  });

  // Confirms the API returns 404 when requested resources do not exist.
  it('returns 404 for missing users and rooms', async () => {
    await request(app.getHttpServer())
      .get('/users/missing-user')
      .expect(404)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error).toMatchObject({
          success: false,
          statusCode: 404,
          message: 'User missing-user not found',
        });
        expect(error.timestamp).toEqual(expect.any(String));
      });

    await request(app.getHttpServer())
      .get('/rooms/missing-room')
      .expect(404)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error).toMatchObject({
          success: false,
          statusCode: 404,
          message: 'Room missing-room not found',
        });
        expect(error.timestamp).toEqual(expect.any(String));
      });

    await request(app.getHttpServer())
      .post('/rooms/MISSING/join')
      .send({ userId: 'missing-user' })
      .expect(400)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error.success).toBe(false);
        expect(error.statusCode).toBe(400);
        expect(error.message).toContain('userId must be a UUID');
      });
  });

  it('rejects invalid request bodies and unknown properties', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'A', email: 'nope' })
      .expect(400)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error.success).toBe(false);
        expect(error.statusCode).toBe(400);
        expect(error.message).toEqual(
          expect.arrayContaining([
            'name must be longer than or equal to 2 characters',
            'email must be an email',
          ]),
        );
      });

    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Alice',
        email: 'alice@santa.test',
        admin: true,
      })
      .expect(400)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error.success).toBe(false);
        expect(error.statusCode).toBe(400);
        expect(error.message).toContain('property admin should not exist');
      });
  });

  it('stores and retrieves wishlists by room and user', async () => {
    const ownerResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Wishlist Owner', email: 'wishlist-owner@santa.test' })
      .expect(201);
    const owner = ownerResponse.body as UserBody;

    const roomResponse = await request(app.getHttpServer())
      .post('/rooms')
      .send({
        name: 'Wishlist Room',
        ownerId: owner.id,
      })
      .expect(201);
    const room = roomResponse.body as RoomBody;

    const updateResponse = await request(app.getHttpServer())
      .post(`/rooms/${room.id}/wishlist`)
      .send({
        userId: owner.id,
        items: ['socks', 'book', 'mug'],
      })
      .expect(201);
    const wishlist = updateResponse.body as WishlistBody;

    expect(wishlist).toEqual({
      roomId: room.id,
      userId: owner.id,
      items: ['socks', 'book', 'mug'],
    });

    await request(app.getHttpServer())
      .get(`/rooms/${room.id}/wishlist/${owner.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(wishlist);
      });

    await request(app.getHttpServer())
      .get(`/rooms/${room.id}/wishlist/missing-user`)
      .expect(404)
      .expect(({ body }) => {
        const error = body as ErrorBody;

        expect(error.success).toBe(false);
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe(
          `Wishlist for room ${room.id} and user missing-user not found`,
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
