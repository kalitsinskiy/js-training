export interface WishlistItem {
  name: string;
  url?: string;
  priority?: number;
}

export interface Wishlist {
  roomId: string;
  userId: string;
  items: WishlistItem[];
}
