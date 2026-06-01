import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RoomsService } from './rooms.service';
import {
  Room as RoomSchemaClass,
  RoomSchema,
  RoomDocument,
} from './schemas/room.schema';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from '../../test/helpers/mongo';

describe('RoomsService', () => {
  let service: RoomsService;
  let roomModel: Model<RoomDocument>;

  beforeAll(async () => {
    const uri = await startInMemoryMongo();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: RoomSchemaClass.name, schema: RoomSchema },
        ]),
      ],
      providers: [RoomsService],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    roomModel = module.get<Model<RoomDocument>>(
      getModelToken(RoomSchemaClass.name),
    );
    await roomModel.ensureIndexes();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await roomModel.deleteMany({});
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('returns a room with id, name, ownerId, code, members, createdAt', async () => {
      const room = await service.create({
        name: 'Testing Party',
        ownerId: 'owner-1',
      });

      expect(room).toEqual({
        id: expect.any(String),
        name: 'Testing Party',
        ownerId: 'owner-1',
        code: expect.any(String),
        members: ['owner-1'],
        status: 'pending',
        createdAt: expect.any(Date),
      });
    });

    test('generates a 6-char uppercase alphanumeric code', async () => {
      const room = await service.create({ name: 'X', ownerId: 'o' });
      expect(room.code).toMatch(/^[A-Z0-9]{6}$/);
    });

    test('generates a unique id and code per room', async () => {
      const a = await service.create({ name: 'A', ownerId: 'o' });
      const b = await service.create({ name: 'B', ownerId: 'o' });

      expect(a.id).not.toEqual(b.id);
      expect(a.code).not.toEqual(b.code);
    });
  });

  describe('findByUser', () => {
    test('returns an empty paginated res when the user has no rooms', async () => {
      const res = await service.findByUser('user-1', {});

      expect(res).toEqual({
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
      });
    });

    test('returns rooms where the user is a participant', async () => {
      const a = await service.create({ name: 'Room A', ownerId: 'owner-1' });
      const b = await service.create({ name: 'Room B', ownerId: 'owner-1' });
      // A room owned by someone else — should not appear
      await service.create({ name: 'Room C', ownerId: 'someone-else' });

      const res = await service.findByUser('owner-1', {});

      expect(res.data).toEqual(expect.arrayContaining([a, b]));
      expect(res.data).toHaveLength(2);
      expect(res.meta.total).toBe(2);
    });

    test('applies pagination', async () => {
      for (const name of ['Room A', 'Room B', 'Room C']) {
        await service.create({ name, ownerId: 'owner-1' });
      }

      const res = await service.findByUser('owner-1', { page: 1, limit: 2 });

      expect(res.data).toHaveLength(2);
      expect(res.meta).toEqual({
        total: 3,
        page: 1,
        limit: 2,
        totalPages: 2,
      });
    });
  });

  describe('findById', () => {
    test('returns the room when it exists', async () => {
      const created = await service.create({ name: 'A', ownerId: 'o' });
      expect(await service.findById(created.id)).toEqual(created);
    });

    test('returns undefined when the room does not exist', async () => {
      const unusedId = new mongoose.Types.ObjectId().toString();
      expect(await service.findById(unusedId)).toBeUndefined();
    });

    test('returns undefined when id is not a valid ObjectId', async () => {
      expect(await service.findById('nope')).toBeUndefined();
    });
  });

  describe('findByCode', () => {
    test('returns the room when the code matches', async () => {
      const created = await service.create({ name: 'A', ownerId: 'o' });
      expect(await service.findByCode(created.code)).toEqual(created);
    });

    test('returns undefined when no room has that code', async () => {
      expect(await service.findByCode('ZZZZZZ')).toBeUndefined();
    });
  });

  describe('addMember', () => {
    test('adds a new member and returns the updated room', async () => {
      const created = await service.create({ name: 'A', ownerId: 'owner-1' });

      const updated = await service.addMember(created.code, 'user-2');

      expect(updated).toBeDefined();
      expect(updated!.members).toEqual(['owner-1', 'user-2']);
    });

    test('does not add duplicates ($addToSet)', async () => {
      const created = await service.create({ name: 'A', ownerId: 'owner-1' });

      await service.addMember(created.code, 'user-2');
      const updated = await service.addMember(created.code, 'user-2');

      expect(updated!.members).toEqual(['owner-1', 'user-2']);
    });

    test('returns undefined when the room does not exist', async () => {
      expect(await service.addMember('ZZZZZZ', 'user-2')).toBeUndefined();
    });

    test('throws ForbiddenException when the room status is "drawn"', async () => {
      const room = await service.create({
        name: 'Drawned Room',
        ownerId: 'ownerId',
      });

      await roomModel.updateOne({ _id: room.id }, { status: 'drawn' });

      await expect(service.addMember(room.code, 'user-2')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('draw', () => {
    async function seedRoom(ownerId: string, membersIds: string[]) {
      const room = await service.create({ name: 'Holiday Party', ownerId });

      for (const memberId of membersIds) {
        await service.addMember(room.code, memberId);
      }

      return await service.findById(room.id);
    }

    test('throws NotFoundException when the room does not exist', async () => {
      const unusedId = new mongoose.Types.ObjectId().toString();

      await expect(service.draw(unusedId, 'owner-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    test('throws NotFoundException when id is not a valid ObjectId', async () => {
      await expect(service.draw('not-an-ObjectId', 'owner-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    test('throws ForbiddenException when a caller is not the owner', async () => {
      const room = await seedRoom('owner-1', ['m1', 'm2']);

      await expect(service.draw(room.id, 'someone-else')).rejects.toThrow(
        ForbiddenException,
      );
    });

    test('throws BadRequestException when participants.length < 3', async () => {
      const room = await seedRoom('owner-1', ['m1']);

      await expect(service.draw(room.id, 'owner-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    test('flips status to "drawn", stamps drawDate and persists', async () => {
      const room = await seedRoom('owner-1', ['m1', 'm2']);
      const drawn = await service.draw(room.id, 'owner-1');

      expect(drawn.status).toBe('drawn');
      expect(drawn.drawDate).toBeInstanceOf(Date);

      const reloaded = (await service.findById(room.id))!;

      expect(reloaded.status).toBe('drawn');
      expect(reloaded.drawDate).toBeInstanceOf(Date);
    });

    test('produces a valid draw: every participant appears as a recipient exactly once and no self-assignment', async () => {
      for (let i = 0; i < 20; i++) {
        await roomModel.deleteMany({});

        const room = await seedRoom('owner-1', ['m1', 'm2', 'm3']);
        const drawn = await service.draw(room.id, 'owner-1');

        expect(drawn.assignments).toBeDefined();

        const map = drawn.assignments!;
        const givers = Object.keys(map);
        const recipients = Object.keys(map);

        expect(new Set(givers)).toEqual(new Set(room.members));
        expect(new Set(recipients)).toEqual(new Set(room.members));
        expect(recipients).toHaveLength(new Set(recipients).size);

        for (const giver of givers) {
          expect(map[giver]).not.toBe(giver);
        }
      }
    });

    test('thows BadRequestException on a second+ tries of drawing the room', async () => {
      const room = await seedRoom('owner-1', ['m1', 'm2']);

      await service.draw(room.id, 'owner-1');

      await expect(service.draw(room.id, 'owner-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
