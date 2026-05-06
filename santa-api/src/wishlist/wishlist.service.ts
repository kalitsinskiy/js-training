import { Injectable } from '@nestjs/common';
import { Wishlist } from './wishlist.types';

@Injectable()
export class WishlistService {
  private readonly wishlists = new Map<string, string[]>();

  set(roomId: string, userId: string, items: string[]): Wishlist {
    this.wishlists.set(this.getKey(roomId, userId), items);

    return {
      roomId,
      userId,
      items,
    };
  }

  get(roomId: string, userId: string): Wishlist | undefined {
    const items = this.wishlists.get(this.getKey(roomId, userId));

    if (!items) {
      return undefined;
    }

    return {
      roomId,
      userId,
      items,
    };
  }

  private getKey(roomId: string, userId: string): string {
    return `${roomId}:${userId}`;
  }
}
