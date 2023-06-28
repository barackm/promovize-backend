import { IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'validation.invalidEmailFormat' })
  email: string;

  password: string;
}
