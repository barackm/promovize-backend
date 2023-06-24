import { Injectable } from '@nestjs/common';
import { AuthUtilsService } from './authUtils.service';

@Injectable()
export class AuthService {
  constructor(private readonly authUtilsService: AuthUtilsService) {}

  async verifyEmail(token: string) {
    try {
      await this.authUtilsService.validateToken(token);
      const isExpired = await this.authUtilsService.isTokenExpired(token);
      if (isExpired) {
      }
    } catch (error) {}
  }
}
