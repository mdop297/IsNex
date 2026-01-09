import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class FindUserDto {
  @ApiPropertyOptional({ description: 'Filter by username' })
  @IsOptional()
  @IsString()
  username?: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'user' })
  role: Role;

  @ApiProperty({ example: true })
  isVerified: boolean;
}

export class PaginatedUserResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];
  @ApiProperty({ example: 1 })
  page: number;
  @ApiProperty({ example: 10 })
  total: number;
}

export class UserProfileResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'user' })
  role: Role;

  @ApiProperty({ example: true })
  isVerified: boolean;

  @ApiProperty({ example: '2023-08-01T12:34:56.789Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-08-01T12:34:56.789Z' })
  updatedAt: Date;
}
