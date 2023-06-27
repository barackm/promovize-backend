import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dtos/register.dto';
import * as _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, hiddenFields } from './entities/user.enitity';
import { EmailService } from 'src/email/email.service';
import { ErrorMessages } from 'src/shared/enums/error.enum';
import { GoogleSigninUser } from 'src/shared/interfaces/auth.interface';
import { TokenService } from '../auth/token.service';
import { StatusesService } from '../statuses/statuses.service';
import { StatusName } from '../statuses/entities/status.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly statusService: StatusesService,
  ) {}

  async create(createUserDto: RegisterDto, prefix: string) {
    const { email, password } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new HttpException(
        ErrorMessages.userAlreadyExists,
        HttpStatus.BAD_REQUEST,
      );
    }
    let newUser: any = this.userRepository.create({
      email,
      password,
    });
    const token = await this.tokenService.generateEmailVerificationToken(
      newUser,
    );
    const status = await this.statusService.getStatusByLabel(
      StatusName.pending,
    );
    newUser.emailVerificationToken = token;
    newUser.status = status;
    newUser = await this.userRepository.save(newUser);
    await this.emailService.sendEmailVerificationEmail(newUser, token, prefix);
    newUser = _.omit(newUser, hiddenFields);
    return {
      user: newUser,
    };
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) {
        throw new HttpException(
          'error.auth.userNotFound',
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateUser(payload: any) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new HttpException(
          'error.auth.userNotFound',
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByToken(token: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { emailVerificationToken: token },
      });
      if (!user) {
        throw new HttpException(
          'error.auth.userNotFound',
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async saveUser(user: User) {
    try {
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createUserFromGoogleProfile(profile: GoogleSigninUser) {
    try {
      const { email, email_verified, family_name, given_name, picture, sub } =
        profile;
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        return existingUser;
      }

      const userStatus = await this.statusService.getStatusByLabel(
        StatusName.active,
      );

      let newUser = this.userRepository.create({
        authMethod: 'google',
        email,
        emailVerified: email_verified,
        firstName: given_name,
        lastName: family_name,
        googleId: sub,
        picture,
        status: userStatus,
      });

      newUser = await this.userRepository.save(newUser);
      const refreshToken = await this.tokenService.generateRefreshToken({
        email,
        id: newUser.id,
      });
      newUser.refreshToken = refreshToken;
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
