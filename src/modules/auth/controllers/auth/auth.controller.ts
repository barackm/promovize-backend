import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { RegisterDto } from '../../dtos/register.dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return registerDto;
  }
}
