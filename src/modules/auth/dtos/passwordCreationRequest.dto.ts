import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class PasswordCreationRequestDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'validation.invalidEmailFormat' })
  email: string;

  @IsOptional()
  prefix: string;
}
