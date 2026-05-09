import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';

/*
Storage: Map<string, string[]> — key is ${roomId}:${userId}, value is the items array
Methods:
set(roomId, userId, items) → store and return { roomId, userId, items }
get(roomId, userId) → return the wishlist or undefined
*/

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishlistService],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set wishlist items', () => {
    const roomId = 'room1';
    const userId = 'user1';
    const items = ['item1', 'item2'];

    const result = service.set(roomId, userId, items);

    expect(result).toEqual({ roomId, userId, items });
  });

  it('should throw error if items is not an array', () => {
    const roomId = 'room1';
    const userId = 'user1';
    const items = 'not-an-array';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => service.set(roomId, userId, items as any)).toThrow();
  });

  it('should throw error if roomId is missing', () => {
    const userId = 'user1';
    const items = ['item1', 'item2'];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => service.set(undefined as any, userId, items)).toThrow();
  });

  it('should throw error if userId is missing', () => {
    const roomId = 'room1';
    const items = ['item1', 'item2'];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => service.set(roomId, undefined as any, items)).toThrow();
  });

  it('should get wishlist items', () => {
    const roomId = 'room1';
    const userId = 'user1';
    const items = ['item1', 'item2'];

    service.set(roomId, userId, items);
    const result = service.get(roomId, userId);
    expect(result).toEqual(items);
  });

  it('should handle multiple users and rooms', () => {
    service.set('room1', 'user1', ['item1']);
    service.set('room1', 'user2', ['item2']);
    service.set('room2', 'user1', ['item3']);

    expect(service.get('room1', 'user1')).toEqual(['item1']);
    expect(service.get('room1', 'user2')).toEqual(['item2']);
    expect(service.get('room2', 'user1')).toEqual(['item3']);
    expect(service.get('room2', 'user2')).toBeUndefined();
  });

  it('should overwrite existing wishlist', () => {
    const roomId = 'room1';
    const userId = 'user1';
    service.set(roomId, userId, ['item1']);
    service.set(roomId, userId, ['item2']);
    const result = service.get(roomId, userId);
    expect(result).toEqual(['item2']);
  });

  it('should return undefined for non-existing wishlist', () => {
    const result = service.get('non-existing-room', 'non-existing-user');
    expect(result).toBeUndefined();
  });

  it('should return undefined for existing room but non-existing user', () => {
    service.set('room1', 'user1', ['item1']);
    const result = service.get('room1', 'non-existing-user');
    expect(result).toBeUndefined();
  });

  it('should return undefined for non-existing room but existing user', () => {
    service.set('room1', 'user1', ['item1']);
    const result = service.get('non-existing-room', 'user1');
    expect(result).toBeUndefined();
  });

  it('should return undefined for empty roomId and userId', () => {
    const result = service.get('', '');
    expect(result).toBeUndefined();
  });

  it('should return undefined for null roomId and userId', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = service.get(null as any, null as any);
    expect(result).toBeUndefined();
  });
});
