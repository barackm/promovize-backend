import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(user?: any) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const payload = {
      sub: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24 * 10,
      secret: 'secret',
    });
    return token;
  }

  async generateEmailVerificationToken(user?: any) {
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const payload = {
      sub: user.id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24 * 3,
      secret: 'secret',
    });
    return token;
  }

  async isTokenExpired(token: string) {
    try {
      const decodedToken = this.jwtService.decode(token);
      const isExpired = Date.now() >= decodedToken['exp'] * 1000;
      return isExpired;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async generateRefreshToken(user?: any) {
    if (!user)
      throw new HttpException('error.auth.userNotFound', HttpStatus.NOT_FOUND);
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24 * 30,
      secret: 'secret',
    });
    return token;
  }
}
