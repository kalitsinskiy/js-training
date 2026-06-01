import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ _id: false })
export class RoomAssignment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  santaId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipientId!: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  name!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creatorId!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  inviteCode!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  participants!: Types.ObjectId[];

  @Prop({ enum: ['pending', 'drawn'], default: 'pending' })
  status!: 'pending' | 'drawn';

  @Prop()
  drawDate?: Date;

  @Prop({
    type: [
      {
        santaId: { type: Types.ObjectId, ref: 'User', required: true },
        recipientId: { type: Types.ObjectId, ref: 'User', required: true },
      },
    ],
    default: [],
  })
  assignments!: RoomAssignment[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
