import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'validation.invalidEmailFormat' })
  email: string;

  @IsNotEmpty()
  password: string;
}
