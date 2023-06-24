import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './controlers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.enitity';
import { AuthUtilsService } from '../auth/authUtils.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthUtilsService, JwtService, EmailService],
})
export class UsersModule {}
