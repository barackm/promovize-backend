import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './controlers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.enitity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from 'aws-sdk';
import { TokenService } from '../auth/token.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    EmailService,
    ConfigService,
    TokenService,
  ],
})
export class UsersModule {}
