import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

const OWNER_ID = '22222222-2222-2222-2222-222222222222';
const USER_ID = '33333333-3333-3333-3333-333333333333';

describe('RoomsController', () => {
  let controller: RoomsController;
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    service = module.get<RoomsService>(RoomsService);
  });

  describe('create', () => {
    it('should create and return a new room', () => {
      const result = controller.create({
        name: 'Test Room',
        ownerId: OWNER_ID,
      });

      expect(result).toMatchObject({
        name: 'Test Room',
        ownerId: OWNER_ID,
        members: [OWNER_ID],
      });
      expect(result.id).toBeDefined();
      expect(result.code).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return empty array when no rooms exist', () => {
      expect(controller.findAll()).toEqual([]);
    });

    it('should return all created rooms', () => {
      service.create({ name: 'Room A', ownerId: OWNER_ID });
      service.create({ name: 'Room B', ownerId: OWNER_ID });

      expect(controller.findAll()).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a room by id', () => {
      const created = service.create({ name: 'Test Room', ownerId: OWNER_ID });

      expect(controller.findOne(created.id)).toEqual(created);
    });

    it('should throw NotFoundException for unknown id', () => {
      expect(() => controller.findOne('non-existent-id')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('join', () => {
    it('should add a member and return the updated room', () => {
      const created = service.create({ name: 'Test Room', ownerId: OWNER_ID });

      const result = controller.join(created.code, { userId: USER_ID });

      expect(result.members).toContain(USER_ID);
    });

    it('should not add duplicate members', () => {
      const created = service.create({ name: 'Test Room', ownerId: OWNER_ID });

      controller.join(created.code, { userId: OWNER_ID });

      expect(controller.findOne(created.id).members).toHaveLength(1);
    });

    it('should throw NotFoundException for unknown code', () => {
      expect(() => controller.join('BADCOD', { userId: USER_ID })).toThrow(
        NotFoundException,
      );
    });
  });
});
