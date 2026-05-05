import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('returns a user with id, name, email and createdAt', () => {
      const user = service.create({
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

    test('generates a unique id for each user', () => {
      const a = service.create({ name: 'Alice', email: 'a@x.com' });
      const b = service.create({ name: 'Bob', email: 'b@x.com' });

      expect(a.id).not.toEqual(b.id);
    });
  });

  describe('findById', () => {
    test('returns te user when it exists', () => {
      const created = service.create({
        name: 'Alice',
        email: 'alice@example.com',
      });

      expect(service.findById(created.id)).toEqual(created);
    });

    test('returns undefined when the user does not exist', () => {
      expect(service.findById('does-not-exist')).toBeUndefined();
    });
  });
});
