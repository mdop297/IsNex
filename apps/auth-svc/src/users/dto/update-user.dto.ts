import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @ApiProperty({
    description: 'User ID',
    example: 'b5f5c19c-87d2-4f77-ae8c-2dbdca09b3cb',
  })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ description: 'Mark user as verified', example: true })
  @IsOptional()
  isVerified?: boolean;
}
