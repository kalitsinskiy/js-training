import { IsArray, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateWishlistDto {
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId!: string;

  @IsArray({ message: 'Items must be an array' })
  @IsString({ each: true, message: 'Each item must be a string' })
  @MinLength(1, {
    each: true,
    message: 'Each item must be at least 1 character long',
  })
  items!: string[];
}
