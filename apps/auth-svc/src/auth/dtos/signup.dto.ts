import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({ example: 'a1b2c3d4' })
  userId: string;

  @ApiProperty({
    example: 'User registered successfully. Please verify your email.',
  })
  message: string;
}
