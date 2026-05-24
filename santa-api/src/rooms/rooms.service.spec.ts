import { Test, TestingModule } from '@nestjs/testing';
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

  describe('findAll', () => {
    test('returns an empty array when no rooms exist', async () => {
      expect(await service.findAll()).toEqual([]);
    });

    test('returns every created room', async () => {
      const a = await service.create({ name: 'A', ownerId: 'o' });
      const b = await service.create({ name: 'B', ownerId: 'o' });

      const all = await service.findAll();
      expect(all).toEqual(expect.arrayContaining([a, b]));
      expect(all).toHaveLength(2);
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
  });
});
