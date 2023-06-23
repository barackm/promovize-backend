import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dtos/register.dto';
import _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, hiddenFields } from './entities/user.enitity';
import { AuthUtilsService } from '../auth/authUtils.module';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly authUtilsService: AuthUtilsService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: RegisterDto) {
    try {
      const { email, password } = createUserDto;
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      let newUser: any = this.userRepository.create({
        email,
        password,
      });
      newUser = await this.userRepository.save(newUser);
      const token = await this.authUtilsService.generateEmailVerificationToken(
        newUser,
      );
      await this.emailService.sendEmailVerificationEmail(newUser, token);
      newUser = _.omit(newUser, hiddenFields);
      return newUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
