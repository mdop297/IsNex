import { User } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class FindUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UserDto {
  id: string;
  email: string;
  username: string;
  address?: string | null;
  isVerified: boolean;
}

export function toUserDto(user: User): UserDto {
  const { id, email, username, address, isVerified } = user;
  return { id, email, username, address, isVerified };
}
