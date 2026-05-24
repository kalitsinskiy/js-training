import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  creatorId!: string;

  @Prop({ required: true, unique: true })
  inviteCode!: string;

  @Prop({ type: [String], default: [] })
  participants!: string[];

  @Prop({ enum: ['pending', 'drawn'], default: 'pending' })
  status!: 'pending' | 'drawn';

  @Prop()
  drawDate?: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
