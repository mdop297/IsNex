import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password (min length 6 characters)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: 'JohnDoe',
    description: 'Optional display name for the user',
  })
  @IsOptional()
  @IsString()
  username?: string;
}
