import { IsMongoId, IsString, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(3, { message: 'Room name must be at least 3 characters long' })
  name!: string;

  @IsMongoId({ message: 'Owner ID must be a valid MongoDB ObjectId' })
  ownerId!: string;
}
