import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'alice@example.com',
    description: 'Email address. Stored lowercased',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'SecretPass1',
    minLength: 8,
    description: 'At least 8 chars',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    example: 'Aclice',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  displayName!: string;
}
