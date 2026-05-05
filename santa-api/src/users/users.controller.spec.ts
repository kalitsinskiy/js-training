import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /users', () => {
    test('delegates to service.create and returns the created user', () => {
      const created: User = {
        id: 'abc-123',
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: new Date('2026-05-04T00:00:00Z'),
      };
      service.create.mockReturnValue(created);

      const result = controller.create({
        name: 'Alice',
        email: 'alice@example.com',
      });

      expect(service.create).toHaveBeenCalledWith({
        name: 'Alice',
        email: 'alice@example.com',
      });
      expect(result).toBe(created);
    });
  });

  describe('GET /users/:id', () => {
    test('returns the user when it exists', () => {
      const found: User = {
        id: 'abc-123',
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: new Date('2026-05-04T00:00:00Z'),
      };
      service.findById.mockReturnValue(found);

      const result = controller.findOne('abc-123');

      expect(service.findById).toHaveBeenCalledWith('abc-123');
      expect(result).toBe(found);
    });

    test('throws NotFoundException when the user does not exist', () => {
      service.findById.mockReturnValue(undefined);

      expect(() => controller.findOne('missing')).toThrow(NotFoundException);
    });
  });
});
