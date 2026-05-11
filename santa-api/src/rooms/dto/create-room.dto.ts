import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(3, { message: 'Room name must be at least 3 characters long' })
  name!: string;

  @IsUUID('4', { message: 'Owner ID must be a valid UUID' })
  ownerId!: string;
}
