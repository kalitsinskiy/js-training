import { IsUUID } from 'class-validator';

export class JoinRoomDto {
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId!: string;
}
