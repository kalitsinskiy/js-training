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

export class WishlistItemDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsNumber()
  priority?: number;
}

export class UpdateWishlistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WishlistItemDto)
  items!: WishlistItemDto[];
}
