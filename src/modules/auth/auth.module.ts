import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.enitity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { StatusesService } from '../statuses/statuses.service';
import { Status } from '../statuses/entities/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Status]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    EmailService,
    ConfigService,
    JwtService,
    TokenService,
    StatusesService,
  ],
})
export class AuthModule {}
