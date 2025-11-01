import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  username: string;

  @IsOptional()
  role: Role;

  @IsOptional()
  isVerified: boolean;
}
