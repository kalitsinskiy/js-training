import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WishlistItemDto {
  @ApiProperty({ example: 'Lego - F1 Car', minLength: 1 })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ example: 'https://example.com/item/123' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Lower = higher priority.',
  })
  @IsOptional()
  @IsNumber()
  priority?: number;
}

export class UpdateWishlistDto {
  @ApiProperty({
    type: [WishlistItemDto],
    description: 'Replaces the user`s wishlist for this room.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WishlistItemDto)
  items!: WishlistItemDto[];
}
