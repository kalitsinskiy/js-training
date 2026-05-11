import { Injectable } from '@nestjs/common';

@Injectable()
export class WishlistService {
  private readonly store = new Map<string, string[]>();

  private key(roomId: string, userId: string): string {
    return `${roomId}:${userId}`;
  }

  set(roomId: string, userId: string, items: string[]) {
    this.store.set(this.key(roomId, userId), items);
    return { roomId, userId, items };
  }

  get(
    roomId: string,
    userId: string,
  ): { roomId: string; userId: string; items: string[] } | undefined {
    const items = this.store.get(this.key(roomId, userId));
    if (items === undefined) return undefined;
    return { roomId, userId, items };
  }
}
