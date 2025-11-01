import { User } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class FindUserDto {
  @IsOptional()
  @IsString()
  username?: string;
}

export class UserDto {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
}

export function toUserDto(user: User): UserDto {
  const { id, email, username, isVerified } = user;
  return { id, email, username, isVerified };
}
