import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserSchema, UserDocument } from './schemas/users.schema';
import {
  startInMemoryMongo,
  stopInMemoryMongo,
} from '../../test/helpers/mongo';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    const uri = await startInMemoryMongo();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));

    await userModel.ensureIndexes();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await stopInMemoryMongo();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWithHash', () => {
    test('returns a UserDocument with _id, email, and displayName', async () => {
      const doc = await service.createWithHash({
        displayName: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'h',
      });

      expect(doc._id).toBeDefined();
      expect(doc.email).toBe('alice@example.com');
      expect(doc.displayName).toBe('Alice');
    });

    test('generates a unique id for each user', async () => {
      const a = await service.createWithHash({
        displayName: 'Alice',
        email: 'a@x.com',
        passwordHash: 'h',
      });
      const b = await service.createWithHash({
        displayName: 'Bob',
        email: 'b@x.com',
        passwordHash: 'h',
      });

      expect(a.id).not.toEqual(b.id);
    });

    test('rejects duplicate email at the DB level', async () => {
      await service.createWithHash({
        displayName: 'Alice',
        email: 'a@x.com',
        passwordHash: 'h',
      });
      await expect(
        service.createWithHash({
          displayName: 'Other Alice',
          email: 'a@x.com',
          passwordHash: 'h',
        }),
      ).rejects.toThrow();
    });
  });

  describe('findById', () => {
    test('returns the user when it exists', async () => {
      const created = await service.createWithHash({
        displayName: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'h',
      });

      const found = await service.findById(created._id.toString());

      expect(found).toEqual({
        id: created._id.toString(),
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: expect.any(Date),
      });
    });

    test('returns undefined when the user does not exist', async () => {
      const unusedId = new mongoose.Types.ObjectId().toString();
      expect(await service.findById(unusedId)).toBeUndefined();
    });

    test('returns undefined when the id is not a valid ObjectId', async () => {
      expect(await service.findById('does-not-exist')).toBeUndefined();
    });
  });

  describe('findByEmail', () => {
    test('returns the user without passwordHash by default', async () => {
      await service.createWithHash({
        displayName: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'h',
      });

      const found = await service.findByEmail('alice@example.com');

      expect(found).toBeDefined();
      expect(found?.email).toBe('alice@example.com');
      expect((found as any).passwordHash).toBeUndefined();
    });

    test('returns the user with passwordHash when withPassword=true', async () => {
      await service.createWithHash({
        email: 'bob@example.com',
        displayName: 'Bob',
        passwordHash: 'pretend-this-is-a-hash',
      });

      const found = await service.findByEmail('bob@example.com', {
        withPassword: true,
      });

      expect(found?.passwordHash).toBe('pretend-this-is-a-hash');
    });

    test('normalize the email to lowercase', async () => {
      await service.createWithHash({
        email: 'carol@example.com',
        displayName: 'Carol',
        passwordHash: 'h',
      });

      expect(await service.findByEmail('CAROL@example.com')).toBeDefined();
    });

    test('returns null when no user matches', async () => {
      expect(await service.findByEmail('no-match@example.com')).toBeNull();
    });
  });
});
