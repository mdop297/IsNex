import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Transform(
    ({
      value,
      obj,
    }: {
      value: string | undefined;
      obj: Partial<CreateUserDto>;
    }) => value || obj.email?.split('@')[0] || '',
    {
      toClassOnly: true,
    },
  )
  username: string;

  address: string;
}
