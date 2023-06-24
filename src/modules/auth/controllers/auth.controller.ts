import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';
import { AuthRoutes } from 'src/routes/authRoutes.enum';
import { VerifyEmailDto } from '../dtos/verifyEmail.dto';
@ApiTags('Authentification')
@Controller(AuthRoutes.root)
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

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
    return await this.usersService.create(registerDto);
  }

  // confirm email
  @Post(AuthRoutes.verifyEmail)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully verified.',
  })
  @ApiOperation({ summary: 'Verify a user email' })
  async verifyEmail(@Body() body: VerifyEmailDto) {
    // return await this.usersService.verifyEmail(body.token);
  }
}
