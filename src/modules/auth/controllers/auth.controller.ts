import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';
import { AuthRoutes } from 'src/routes/authRoutes.enum';
import { VerifyEmailDto } from '../dtos/verifyEmail.dto';
import { ConfigService } from '@nestjs/config';
import { GoogleSigninDto } from '../dtos/googleSignin.dto';
import { AuthService } from '../auth.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import * as _ from 'lodash';
import { hiddenFields } from 'src/modules/users/entities/user.enitity';
@ApiTags('Authentification')
@Controller(AuthRoutes.root)
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Post(AuthRoutes.register)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
  })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    console.log('RegisterDto', registerDto);
    return await this.usersService.create(registerDto);
  }

  @Post(AuthRoutes.verifyEmail)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully verified.',
  })
  @ApiOperation({ summary: 'Verify a user email' })
  async verifyEmail(@Body() body: VerifyEmailDto) {
    // return await this.usersService.verifyEmail(body.token);
  }

  @Post(AuthRoutes.googleAuthRedirect)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully verified.',
  })
  @ApiOperation({ summary: 'Verify a user idToken with google' })
  async googleAuthRedirect(@Body() body: GoogleSigninDto) {
    return await this.authService.verifyGoogleIdToken(body.idToken);
  }

  @Get(AuthRoutes.me)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data has been successfully retrieved.',
  })
  @ApiOperation({ summary: 'Get user data' })
  @UseGuards(AuthGuard)
  async getUserData(@Req() request: any) {
    try {
      const user = await request.user;
      const userData = await this.usersService.findOne(user.sub);
      return { user: _.omit(userData, hiddenFields) };
    } catch (error) {
      throw new HttpException(
        error.message || 'error.internalServerError',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
