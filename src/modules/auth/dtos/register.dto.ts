import { IsEmail, MinLength, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'validation.invalidEmailFormat' })
  email: string;

  @MinLength(8, { message: 'validation.passwordLength' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*\s)?[A-Za-z\d\s]{8,}$/, {
    message: 'validation.passwordComplexity',
  })
  password: string;

  @IsOptional()
  prefix: string;
}
