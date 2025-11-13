import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email used for login',
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
}

export class SigninResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJI...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1...' })
  refreshToken: string;

  @ApiProperty({ example: { userId: '123', email: 'abc@gmail.com' } })
  user: {
    userId: string;
    email: string;
    username?: string;
  };
}
