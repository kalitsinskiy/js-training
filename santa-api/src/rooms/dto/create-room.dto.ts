import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Name of the Secret Santa room',
    example: 'Office Party 2025',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    description: 'Date when the Secret Santa draw will happen',
    example: '2025-12-20T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  drawDate?: string;
}
