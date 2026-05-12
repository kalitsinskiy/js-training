import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema({ _id: false })
export class WishlistItem {
  @Prop({ required: true })
  name!: string;

  @Prop()
  url?: string;

  @Prop()
  priority?: number;
}

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId!: Types.ObjectId;

  @Prop({ type: [WishlistItem], default: [] })
  items!: WishlistItem[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.index({ userId: 1, roomId: 1 }, { unique: true });
