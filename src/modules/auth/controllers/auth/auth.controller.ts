import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterDto } from '../../dtos/register.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return registerDto;
  }
}
