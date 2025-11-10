import { User } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class FindUserDto {
  @ApiPropertyOptional({ description: 'Filter by username' })
  @IsOptional()
  @IsString()
  username?: string;
}

export class UserDto {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: true })
  isVerified: boolean;
}

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    isVerified: user.isVerified,
  };
}
