import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
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

  @ApiPropertyOptional({
    enum: Role,
    example: Role.USER,
    description: 'User role, defaults to USER',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    example: false,
    description: 'Email verification status',
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
