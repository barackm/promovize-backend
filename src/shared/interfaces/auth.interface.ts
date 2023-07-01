export interface GoogleSigninUser {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
  sub: string;
}
