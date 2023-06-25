import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18nService: I18nService,
    private readonly configService: ConfigService,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const env = this.configService.get('nodeEnv');

    if (!response) {
      return;
    }
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const message = await this.getErrorMessage('error.internalServerError');
      response?.status(status).json({
        message,
        stack: exception.stack,
        ...(env === 'development' ? { stack: exception.stack } : {}),
      });
    } else {
      const message = await this.getErrorMessage(exception.message);
      response.status(status).json({
        message,
        statusCode: status,
        ...(env === 'development' ? { stack: exception.stack } : {}),
      });
    }
  }

  private async getErrorMessage(key: string): Promise<string> {
    return this.i18nService.translate(key);
  }
}
