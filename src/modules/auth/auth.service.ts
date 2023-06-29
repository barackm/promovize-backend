import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as _ from 'lodash';
import { TokenService } from './token.service';
import { hiddenFields } from '../users/entities/user.enitity';
import { StatusesService } from '../statuses/statuses.service';
import { StatusName } from '../statuses/entities/status.entity';
import * as bcrypt from 'bcryptjs';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  private readonly googleClientId: string;
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly statusesService: StatusesService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {
    this.googleClientId = this.configService.get<string>('google.clientId');
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async login(email: string, password: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new HttpException(
          'error.auth.invalidEmailOrPassword',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user.googleId && !user.password) {
        throw new HttpException(
          'error.auth.account_created_with_google',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.usersService.validatePassword(password, user.password);
      const accessToken = await this.tokenService.generateAccessToken(user);
      const refreshToken = await this.tokenService.generateRefreshToken(user);
      user.refreshToken = refreshToken;
      await this.usersService.saveUser(user);

      return {
        user: _.omit(user, hiddenFields),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyGoogleIdToken(token: string) {
    try {
      const isExpired = await this.tokenService.isTokenExpired(token);

      if (isExpired) {
        throw new HttpException(
          'error.auth.tokenExpired',
          HttpStatus.BAD_REQUEST,
        );
      }
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

      const accessToken = await this.tokenService.generateAccessToken(user);
      const refreshToken = user.refreshToken;
      return {
        user: _.omit(user, hiddenFields),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyEmail(token: string) {
    try {
      const decodedToken = await this.tokenService.validateToken(token);
      const { email } = decodedToken;
      let user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new HttpException(
          'error.auth.userNotFound',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user.emailVerified) {
        throw new HttpException(
          'error.auth.emailAlreadyVerified',
          HttpStatus.BAD_REQUEST,
        );
      }
      const accessToken = await this.tokenService.generateAccessToken(user);
      const refreshToken = await this.tokenService.generateRefreshToken(user);
      const status = await this.statusesService.getStatusByLabel(
        StatusName.incomplete,
      );

      user.emailVerified = true;
      user.emailVerificationToken = null;
      user.refreshToken = refreshToken;
      user.status = status;
      user = await this.usersService.saveUser(user);
      return {
        user: _.omit(user, hiddenFields),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async forgotPassword(email: string, prefix) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new HttpException(
          'error.auth.invalidEmail',
          HttpStatus.BAD_REQUEST,
        );
      }

      const token = await this.tokenService.generateForgotPasswordToken(user);
      user.passwordResetToken = token;
      await this.usersService.saveUser(user);
      await this.emailService.sendPasswordResetEmail(user, token, prefix);
      return {
        message: 'events.auth.reset_password_email_sent',
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const decodedToken = await this.tokenService.validateToken(token);
      const { email } = decodedToken;
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new HttpException(
          'error.auth.invalidEmail',
          HttpStatus.BAD_REQUEST,
        );
      }

      const tokensSame = user.passwordResetToken === token;
      if (!tokensSame) {
        throw new HttpException(
          'error.auth.invalidToken',
          HttpStatus.BAD_REQUEST,
        );
      }
      const passwordsSame = await bcrypt.compare(
        password,
        user.passwordResetToken,
      );

      if (passwordsSame) {
        throw new HttpException(
          'error.auth.passwordsSame',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.passwordResetToken = null;
      await this.usersService.saveUser(user);

      return {
        message: 'events.auth.password_reset_success',
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async requestGooglePasswordCreation(email: string, prefix) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new HttpException(
          'error.auth.invalidEmail',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!user.googleId) {
        throw new HttpException(
          'error.auth.notGoogleUser',
          HttpStatus.BAD_REQUEST,
        );
      }

      const token = await this.tokenService.generateForgotPasswordToken(user);
      user.passwordResetToken = token;
      await this.usersService.saveUser(user);
      await this.emailService.sendGooglePasswordCreationEmail(
        user,
        token,
        prefix,
      );
      return {
        message: 'events.auth.create_password_email_sent',
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPassword(token: string, password: string) {
    try {
      const decodedToken = await this.tokenService.validateToken(token);
      const { email } = decodedToken;
      let user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new HttpException(
          'error.auth.invalidEmail',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!user.googleId) {
        throw new HttpException(
          'error.auth.notGoogleUser',
          HttpStatus.BAD_REQUEST,
        );
      }

      const tokensSame = user.passwordResetToken === token;
      if (!tokensSame) {
        throw new HttpException(
          'error.auth.invalidToken',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.emailVerified = true;
      const accessToken = await this.tokenService.generateAccessToken(user);
      const refreshToken = await this.tokenService.generateRefreshToken(user);
      user.refreshToken = refreshToken;
      user = await this.usersService.saveUser(user);

      return {
        user: _.omit(user, hiddenFields),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
