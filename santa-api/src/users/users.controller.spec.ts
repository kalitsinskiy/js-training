import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create and return a new user', () => {
      const result = controller.create({
        name: 'Alice',
        email: 'alice@example.com',
      });

      expect(result).toMatchObject({
        name: 'Alice',
        email: 'alice@example.com',
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      const created = service.create({
        name: 'Alice',
        email: 'alice@example.com',
      });

      expect(controller.findOne(created.id)).toEqual(created);
    });

    it('should throw NotFoundException for unknown id', () => {
      expect(() => controller.findOne('non-existent-id')).toThrow(
        NotFoundException,
      );
    });
  });
});
