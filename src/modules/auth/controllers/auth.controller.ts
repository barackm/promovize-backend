import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';
import { AuthRoutes } from 'src/routes/authRoutes.enum';
import { GoogleSigninDto } from '../dtos/googleSignin.dto';
import { AuthService } from '../auth.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import * as _ from 'lodash';
import { hiddenFields } from 'src/modules/users/entities/user.enitity';
import { LoginDto } from '../dtos/login.dto';
import { ResetPasswordDto } from '../dtos/resetPassword.dto';
import { CreatePasswordDto } from '../dtos/createPassword.dto';
import { PasswordCreationRequestDto } from '../dtos/passwordCreationRequest.dto';
@ApiTags('Authentification')
@Controller(AuthRoutes.root)
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
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
    const { prefix } = registerDto;
    return await this.usersService.create(registerDto, prefix);
  }

  @Get(AuthRoutes.verifyEmail)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully verified.',
  })
  @ApiOperation({ summary: 'Verify a user email' })
  async verifyEmail(@Query() query: any) {
    const { token } = query;
    return await this.authService.verifyEmail(token);
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

  @Post(AuthRoutes.login)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully logged in.',
  })
  @ApiOperation({ summary: 'Login a user' })
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    return await this.authService.login(email, password);
  }

  @Post(AuthRoutes.forgotPassword)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset email has been successfully sent.',
  })
  @ApiOperation({ summary: 'Send a password reset email' })
  async forgotPassword(@Body() body: any) {
    const { email, prefix } = body;
    return await this.authService.forgotPassword(email, prefix);
  }

  @Post(AuthRoutes.resetPassword)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password has been successfully reset.',
  })
  @ApiOperation({ summary: 'Reset a user password' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { token, password } = body;
    return await this.authService.resetPassword(token, password);
  }

  @Post(AuthRoutes.requestGooglePasswordCreation)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password creation email has been successfully sent.',
  })
  @ApiOperation({ summary: 'Send a password creation email' })
  async requestGooglePasswordCreation(
    @Body() body: PasswordCreationRequestDto,
  ) {
    const { email, prefix } = body;
    return await this.authService.requestGooglePasswordCreation(email, prefix);
  }

  @Post(AuthRoutes.createPassword)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password has been successfully created.',
  })
  @ApiOperation({ summary: 'Create a user password' })
  async createPassword(@Body() body: CreatePasswordDto) {
    const { token, password } = body;
    return await this.authService.createPassword(token, password);
  }
}
