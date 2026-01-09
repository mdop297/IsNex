import { OmitType } from '@nestjs/mapped-types';
import { UserCreateDto } from './create-user.dto';
import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserUpdateDto extends OmitType(UserCreateDto, [
  'password',
] as const) {
  @Exclude()
  @ApiPropertyOptional({ description: 'Mark user as verified', example: true })
  @IsOptional()
  isVerified?: boolean;
}
