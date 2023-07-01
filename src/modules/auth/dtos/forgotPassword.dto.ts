import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'validation.invalidEmailFormat' })
  email: string;

  @IsOptional()
  prefix: string;
}
