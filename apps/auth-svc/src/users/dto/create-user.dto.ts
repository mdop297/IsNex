import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  address: string | null;

  @IsOptional()
  role: Role;

  @IsOptional()
  isVerified: boolean;
}
