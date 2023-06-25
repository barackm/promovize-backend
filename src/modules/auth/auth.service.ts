import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { TokenService } from './token.service';
import { hiddenFields } from '../users/entities/user.enitity';

@Injectable()
export class AuthService {
  private readonly googleClientId: string;
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {
    this.googleClientId = this.configService.get<string>('google.clientId');
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async verifyEmail(token: string) {
    try {
      await this.validateToken(token);
      const isExpired = await this.tokenService.isTokenExpired(token);
      if (isExpired) {
      }
    } catch (error) {}
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyGoogleIdToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: [this.googleClientId],
      });

      const payload = ticket.getPayload();
      const {
        email,
        name,
        picture,
        given_name,
        family_name,
        email_verified,
        sub,
      } = payload;

      const userProfile = {
        email,
        name,
        picture,
        given_name,
        family_name,
        email_verified,
        sub,
      };

      if (!email_verified) {
        throw new HttpException(
          'error.auth.emailNotVerified',
          HttpStatus.BAD_REQUEST,
        );
      }

      let user = await this.usersService.findOneByEmail(email);
      if (!user) {
        user = await this.usersService.createUserFromGoogleProfile(userProfile);
      }

      const authToken = await this.tokenService.generateAuthToken(user);
      const refreshToken = user.refreshToken;
      return {
        user: _.omit(user, hiddenFields),
        authToken,
        refreshToken,
      };
      return user;
    } catch (error) {
      throw error;
    }
  }
}
