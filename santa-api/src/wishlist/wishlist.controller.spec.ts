import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

describe('WishlistController', () => {
  let controller: WishlistController;
  const mockWishlistService = {
    set: jest.fn(),
    get: jest.fn(),
  };
  const mockRoomsService = {
    findByCode: jest.fn(),
  };
  const mockUserService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        {
          provide: WishlistService,
          useValue: mockWishlistService,
        },
        {
          provide: RoomsService,
          useValue: mockRoomsService,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call WishlistService.set when setting a wishlist', () => {
    const roomCode = 'room1';
    const userId = 'user1';
    const items = ['item1', 'item2'];

    mockRoomsService.findByCode.mockReturnValue({ id: roomCode });
    mockUserService.findById.mockReturnValue({ id: userId });
    controller.setWishlist(roomCode, { userId, items });

    expect(mockWishlistService.set).toHaveBeenCalledWith(
      roomCode,
      userId,
      items,
    );
  });

  it('should throw NotFoundException if room does not exist when setting a wishlist', () => {
    const roomCode = 'nonexistentRoom';
    const userId = 'user1';
    const items = ['item1', 'item2'];
    mockRoomsService.findByCode.mockReturnValue(undefined);
    expect(() => controller.setWishlist(roomCode, { userId, items })).toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if user does not exist when setting a wishlist', () => {
    const roomCode = 'room1';
    const userId = 'nonexistentUser';
    const items = ['item1', 'item2'];
    mockRoomsService.findByCode.mockReturnValue({ id: roomCode });
    mockUserService.findById.mockReturnValue(undefined);
    expect(() => controller.setWishlist(roomCode, { userId, items })).toThrow(
      NotFoundException,
    );
  });

  it('should call WishlistService.get when getting a wishlist', () => {
    const roomCode = 'room1';
    const userId = 'user1';
    const wishlist = ['item1', 'item2'];
    mockWishlistService.get.mockReturnValue(wishlist);
    mockRoomsService.findByCode.mockReturnValue({ id: roomCode });
    mockUserService.findById.mockReturnValue({ id: userId });
    const result = controller.getWishlist(roomCode, userId);

    expect(mockWishlistService.get).toHaveBeenCalledWith(roomCode, userId);
    expect(result).toEqual(wishlist);
  });

  it('should throw NotFoundException if room does not exist when getting a wishlist', () => {
    const roomCode = 'nonexistentRoom';
    const userId = 'user1';
    mockRoomsService.findByCode.mockReturnValue(undefined);
    expect(() => controller.getWishlist(roomCode, userId)).toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if user does not exist when getting a wishlist', () => {
    const roomCode = 'room1';
    const userId = 'nonexistentUser';
    mockRoomsService.findByCode.mockReturnValue({ id: roomCode });
    mockUserService.findById.mockReturnValue(undefined);
    expect(() => controller.getWishlist(roomCode, userId)).toThrow(
      NotFoundException,
    );
  });
});
