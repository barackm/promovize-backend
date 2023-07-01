export interface IAuthService {
  generateEmailVerificationToken(): Promise<string>;
}
