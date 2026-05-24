import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WishlistDocument = HydratedDocument<Wishlist>;

export interface WishlistItem {
  name: string;
  url?: string;
  priority?: number;
}

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  roomId!: string;

  @Prop({
    type: [
      { name: { type: String, required: true }, url: String, priority: Number },
    ],
    default: [],
    _id: false,
  })
  items!: WishlistItem[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.index({ userId: 1, roomId: 1 }, { unique: true });
