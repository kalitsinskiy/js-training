import { Injectable } from '@nestjs/common';

@Injectable()
export class WishlistService {
  private readonly store = new Map<string, string[]>();

  set(roomId: string, userId: string, items: string[]) {
    this.store.set(`${roomId}:${userId}`, items);
    return { roomId, userId, items };
  }

  get(roomId: string, userId: string) {
    const items = this.store.get(`${roomId}:${userId}`);
    if (items === undefined) return undefined;
    return { roomId, userId, items };
  }
}
