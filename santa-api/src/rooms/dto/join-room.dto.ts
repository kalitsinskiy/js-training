import { IsMongoId } from 'class-validator';

export class JoinRoomDto {
  @IsMongoId()
  userId!: string;
}
