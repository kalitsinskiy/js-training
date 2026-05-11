import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

describe('WishlistController', () => {
  let controller: WishlistController;
  let service: WishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [WishlistService],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
    service = module.get<WishlistService>(WishlistService);
  });

  describe('set', () => {
    it('should store and return the wishlist', () => {
      const result = controller.set('room-1', {
        userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        items: ['toy car', 'book'],
      });

      expect(result).toEqual({
        roomId: 'room-1',
        userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        items: ['toy car', 'book'],
      });
    });
  });

  describe('get', () => {
    it('should return the wishlist for an existing entry', () => {
      service.set('room-1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', [
        'toy car',
        'book',
      ]);

      expect(
        controller.get('room-1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
      ).toEqual({
        roomId: 'room-1',
        userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        items: ['toy car', 'book'],
      });
    });

    it('should throw NotFoundException for an unknown roomId/userId combination', () => {
      expect(() => controller.get('room-1', 'non-existent-user')).toThrow(
        NotFoundException,
      );
    });
  });
});
