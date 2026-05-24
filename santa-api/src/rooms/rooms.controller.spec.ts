import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService, type Room } from './rooms.service';

const buildRoom = (overrides: Partial<Room> = {}): Room => ({
  id: 'room-1',
  name: 'Testing Room',
  ownerId: 'owner-1',
  code: 'ABC123',
  members: ['owner-1'],
  createdAt: new Date('2026-05-05T00:00:00Z'),
  ...overrides,
});

describe('RoomsController', () => {
  let controller: RoomsController;
  let service: jest.Mocked<RoomsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        {
          provide: RoomsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            addMember: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    service = module.get(RoomsService);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /rooms', () => {
    test('delegates to service.create and return the created room', async () => {
      const room = buildRoom();
      service.create.mockResolvedValue(room);

      const result = await controller.create({
        name: 'Testing Room',
        ownerId: 'owner-1',
      });

      expect(service.create).toHaveBeenCalledWith({
        name: 'Testing Room',
        ownerId: 'owner-1',
      });
      expect(result).toBe(room);
    });
  });

  describe('GET /rooms', () => {
    test('returns all rooms', async () => {
      const rooms = [
        buildRoom({ id: 'a' }),
        buildRoom({ id: 'b', code: 'XYZ789' }),
      ];
      service.findAll.mockResolvedValue(rooms);

      expect(await controller.findAll()).toBe(rooms);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /rooms/:id', () => {
    test('returns the room when it exists', async () => {
      const room = buildRoom();
      service.findById.mockResolvedValue(room);

      expect(await controller.findOne('room-1')).toBe(room);
      expect(service.findById).toHaveBeenCalledWith('room-1');
    });

    test('throws NotFoundException when the room does not exist', async () => {
      service.findById.mockResolvedValue(undefined);

      await expect(controller.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('POST /rooms/:code/join', () => {
    test('delegates to service.addMember and returns the updated room', async () => {
      const updated = buildRoom({ members: ['owner-1', 'user-2'] });
      service.addMember.mockResolvedValue(updated);

      const result = await controller.join('ABC123', { userId: 'user-2' });

      expect(service.addMember).toHaveBeenCalledWith('ABC123', 'user-2');
      expect(result).toBe(updated);
    });

    test('throws NotFoundException when no room has that code', async () => {
      service.addMember.mockResolvedValue(undefined);

      await expect(
        controller.join('ZZZZZZ', { userId: 'user-2' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
