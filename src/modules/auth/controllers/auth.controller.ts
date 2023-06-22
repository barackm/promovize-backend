import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { UsersService } from 'src/modules/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.usersService.create(registerDto);
  }
}
