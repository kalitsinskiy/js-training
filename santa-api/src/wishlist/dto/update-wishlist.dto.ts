import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class WishlistItemDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  priority?: number;
}

export class UpdateWishlistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WishlistItemDto)
  items!: WishlistItemDto[];
}
