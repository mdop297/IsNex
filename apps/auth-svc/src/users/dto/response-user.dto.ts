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

// export function toUserDto(user: User): UserDto {
//   return {
//     id: user.id,
//     email: user.email,
//     username: user.username,
//     isVerified: user.isVerified,
//   };
// }
