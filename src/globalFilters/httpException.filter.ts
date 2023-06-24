import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from 'aws-sdk';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18nService: I18nService,
    private readonly configService: ConfigService,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    console.log('here we are');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const message = await this.getErrorMessage('error.internalServerError');
      response.status(status).json({
        message,
        statusCode: status,
        stack: exception.stack,
      });
    } else {
      const message = await this.getErrorMessage(exception.message);
      response.status(status).json({
        message,
        statusCode: status,
      });
    }
  }

  private async getErrorMessage(key: string): Promise<string> {
    return this.i18nService.translate(key);
  }
}
