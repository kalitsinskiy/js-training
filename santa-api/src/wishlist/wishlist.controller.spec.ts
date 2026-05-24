import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { WishlistController } from './wishlist.controller';
import { WishlistService, type Wishlist } from './wishlist.service';
import { rejects } from 'node:assert';

describe('WishlistController', () => {
  let controller: WishlistController;
  let service: jest.Mocked<WishlistService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        {
          provide: WishlistService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
    service = module.get(WishlistService);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /rooms/:roomId/wishlist', () => {
    test('delegates to service.set with roomId from the path and returns the wishlist', async () => {
      const roomId = randomUUID();
      const userId = randomUUID();
      const wishlist: Wishlist = {
        roomId,
        userId,
        items: [{ name: 'car accessories' }, { name: 'cup' }],
      };
      service.set.mockResolvedValue(wishlist);

      const result = await controller.upsert(roomId, {
        userId,
        items: [{ name: 'car accessories' }, { name: 'cup' }],
      });

      expect(service.set).toHaveBeenCalledWith(roomId, userId, [
        { name: 'car accessories' },
        { name: 'cup' },
      ]);
      expect(result).toBe(wishlist);
    });
  });

  describe('GET /rooms/:roomId/wishlist/:userId', () => {
    test('returns the wishlist when one exists', async () => {
      const roomId = randomUUID();
      const userId = randomUUID();
      const wishlist: Wishlist = { roomId, userId, items: [{ name: 'cup' }] };
      service.get.mockResolvedValue(wishlist);

      const result = await controller.findOne(roomId, userId);

      expect(service.get).toHaveBeenCalledWith(roomId, userId);
      expect(result).toBe(wishlist);
    });

    test('throws NotFoundException when no wishlist exists', async () => {
      service.get.mockResolvedValue(undefined);

      await expect(() =>
        controller.findOne(randomUUID(), randomUUID()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
