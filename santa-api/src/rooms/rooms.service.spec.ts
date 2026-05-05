import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsService],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('returns a room with id, name, ownerId, code, members, createdAt', () => {
      const room = service.create({
        name: 'Testing Party',
        ownerId: 'owner-1',
      });

      expect(room).toEqual({
        id: expect.any(String),
        name: 'Testing Party',
        ownerId: 'owner-1',
        code: expect.any(String),
        members: ['owner-1'],
        createdAt: expect.any(Date),
      });
    });

    test('generates a 6-char uppercase alphanumeric code', () => {
      const room = service.create({ name: 'X', ownerId: 'o' });
      expect(room.code).toMatch(/^[A-Z0-9]{6}$/);
    });

    test('generates a unique id and code per room', () => {
      const a = service.create({ name: 'A', ownerId: 'o' });
      const b = service.create({ name: 'B', ownerId: 'o' });

      expect(a.id).not.toEqual(b.id);
      expect(a.code).not.toEqual(b.code);
    });
  });

  describe('findAll', () => {
    test('returns an empty array when no rooms exist', () => {
      expect(service.findAll()).toEqual([]);
    });

    test('returns every created room', () => {
      const a = service.create({ name: 'A', ownerId: 'o' });
      const b = service.create({ name: 'B', ownerId: 'o' });

      expect(service.findAll()).toEqual(expect.arrayContaining([a, b]));
      expect(service.findAll()).toHaveLength(2);
    });
  });

  describe('findById', () => {
    test('returns the room when it exists', () => {
      const created = service.create({ name: 'A', ownerId: 'o' });
      expect(service.findById(created.id)).toEqual(created);
    });

    test('returns undefined when the room does not exist', () => {
      expect(service.findById('nope')).toBeUndefined();
    });
  });

  describe('findByCode', () => {
    test('returns the room when the code matches', () => {
      const created = service.create({ name: 'A', ownerId: 'o' });
      expect(service.findByCode(created.code)).toEqual(created);
    });

    test('returns undefined when no room has that code', () => {
      expect(service.findByCode('ZZZZZZ')).toBeUndefined();
    });
  });

  describe('addMember', () => {
    test('adds a new member and returns the updated room', () => {
      const created = service.create({ name: 'A', ownerId: 'owner-1' });

      const updated = service.addMember(created.code, 'user-2');

      expect(updated).toBeDefined();
      expect(updated!.members).toEqual(['owner-1', 'user-2']);
    });

    test('does not add duplicates', () => {
      const created = service.create({ name: 'A', ownerId: 'owner-1' });

      service.addMember(created.code, 'user-2');
      const updated = service.addMember(created.code, 'user-2');

      expect(updated!.members).toEqual(['owner-1', 'user-2']);
    });

    test('returns undefined when the room does not exist', () => {
      expect(service.addMember('ZZZZZZ', 'user-2')).toBeUndefined();
    });
  });
});
