import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

const OWNER_ID = '507f1f77bcf86cd799439011';
const USER_ID = '507f1f77bcf86cd799439012';

const mockService = {
  create: jest.fn<() => Promise<any>>(),
  findAll: jest.fn<() => Promise<any>>(),
  findById: jest.fn<() => Promise<any>>(),
  addMember: jest.fn<() => Promise<any>>(),
};

describe('RoomsController', () => {
  let controller: RoomsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [{ provide: RoomsService, useValue: mockService }],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
  });

  describe('create', () => {
    it('should create and return a new room', async () => {
      const mockRoom = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Room',
        creatorId: OWNER_ID,
        inviteCode: 'ABC123',
        participants: [OWNER_ID],
        status: 'pending',
      };
      mockService.create.mockResolvedValue(mockRoom);

      const result = await controller.create({ name: 'Test Room', ownerId: OWNER_ID });

      expect(result).toEqual(mockRoom);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no rooms exist', async () => {
      mockService.findAll.mockResolvedValue([]);

      expect(await controller.findAll()).toEqual([]);
    });

    it('should return all created rooms', async () => {
      mockService.findAll.mockResolvedValue([{}, {}]);

      expect(await controller.findAll()).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a room by id', async () => {
      const mockRoom = { _id: '507f1f77bcf86cd799439011', name: 'Test Room' };
      mockService.findById.mockResolvedValue(mockRoom);

      expect(await controller.findOne('507f1f77bcf86cd799439011')).toEqual(mockRoom);
    });

    it('should throw NotFoundException for unknown id', async () => {
      mockService.findById.mockResolvedValue(null);

      await expect(
        controller.findOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('join', () => {
    it('should add a member and return the updated room', async () => {
      const mockRoom = { participants: [OWNER_ID, USER_ID] };
      mockService.addMember.mockResolvedValue(mockRoom);

      const result = await controller.join('ABC123', { userId: USER_ID });

      expect(result).toEqual(mockRoom);
    });

    it('should throw NotFoundException for unknown code', async () => {
      mockService.addMember.mockResolvedValue(null);

      await expect(
        controller.join('BADCOD', { userId: USER_ID }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
