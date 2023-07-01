import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleSigninDto {
  @IsString()
  @IsNotEmpty()
  readonly idToken: string;
}
