import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserSchema, UserDocument } from './schemas/users.shcema';
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

  describe('create', () => {
    test('return a user with id, name and createdAt', async () => {
      const user = await service.create({
        name: 'Alice',
        email: 'alice@example.com',
      });

      expect(user).toEqual({
        id: expect.any(String),
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: expect.any(Date),
      });
    });

    test('generates a unique id for each user', async () => {
      const a = await service.create({ name: 'Alice', email: 'a@x.com' });
      const b = await service.create({ name: 'Bob', email: 'b@x.com' });

      expect(a.id).not.toEqual(b.id);
    });

    test('rejects duplicate email at the DB level', async () => {
      await service.create({ name: 'Alice', email: 'a@x.com' });
      await expect(
        service.create({ name: 'Other Alice', email: 'a@x.com' }),
      ).rejects.toThrow();
    });
  });

  describe('findById', () => {
    test('returns the user when it exists', async () => {
      const created = await service.create({
        name: 'Alice',
        email: 'alice@example.com',
      });

      expect(await service.findById(created.id)).toEqual(created);
    });

    test('returns undefined when the user does not exist', async () => {
      const unusedId = new mongoose.Types.ObjectId().toString();
      expect(await service.findById(unusedId)).toBeUndefined();
    });

    test('returns undefined when the id is not a valid ObjectId', async () => {
      expect(await service.findById('does-not-exist')).toBeUndefined();
    });
  });
});
