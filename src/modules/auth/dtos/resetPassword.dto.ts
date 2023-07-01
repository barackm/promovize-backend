import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'validation.passwordLength' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*\s)?[A-Za-z\d\s]{8,}$/, {
    message: 'validation.passwordComplexity',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
