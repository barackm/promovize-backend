import { Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @MinLength(8, { message: 'validation.passwordLength' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*\s)?[A-Za-z\d\s]{8,}$/, {
    message: 'validation.passwordComplexity',
  })
  password: string;

  @MinLength(8, { message: 'validation.passwordLength' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*\s)?[A-Za-z\d\s]{8,}$/, {
    message: 'validation.passwordComplexity',
  })
  oldPassword: string;
}
