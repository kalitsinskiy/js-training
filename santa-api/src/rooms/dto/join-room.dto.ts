import { IsUUID } from 'class-validator';

export default class JoinRoomDto {
  @IsUUID()
  userId: string;
}
