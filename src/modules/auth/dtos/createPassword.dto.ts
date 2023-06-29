import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'validation.passwordLength' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*\s)?[A-Za-z\d\s]{8,}$/, {
    message: 'validation.passwordComplexity',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  readonly token: string;
}
