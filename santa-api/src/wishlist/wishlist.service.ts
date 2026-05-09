import { Injectable } from '@nestjs/common';

@Injectable()
export class WishlistService {
  private storage = new Map<string, string[]>();

  set(roomId: string, userId: string, items: string[]) {
    this.validateRoomId(roomId);
    this.validateUserId(userId);
    this.validateItems(items);

    const key = this.getKey(roomId, userId);
    this.storage.set(key, items);
    return { roomId, userId, items };
  }

  get(roomId: string, userId: string) {
    if (!roomId || !userId) {
      return undefined;
    }

    const key = this.getKey(roomId, userId);
    return this.storage.get(key);
  }

  private getKey(roomId: string, userId: string) {
    return `${roomId}:${userId}`;
  }

  private validateItems(items: any) {
    if (!Array.isArray(items)) {
      throw new Error('Items must be an array');
    }
  }

  private validateRoomId(roomId: any) {
    if (!roomId) {
      throw new Error('roomId is required');
    }
  }

  private validateUserId(userId: any) {
    if (!userId) {
      throw new Error('userId is required');
    }
  }
}
