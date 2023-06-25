import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18nService: I18nService,
    private readonly configService: ConfigService,
    private readonly httpAdapter: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapter;
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const env = this.configService.get('NODE_ENV');
    this.logger.error(exception);
    const resBody = {};

    if (env === 'development') {
      resBody['stack'] = exception.stack;
    }

    if (exception instanceof BadRequestException) {
      const validationErrors = exception.getResponse();
      const firstErrorMessage = Object.values(
        validationErrors as Record<string, any>,
      )[0];
      if (Array.isArray(firstErrorMessage)) {
        const translatedErrors = await Promise.all(
          firstErrorMessage.map(async (error) => {
            const translatedError = await this.getErrorMessage(error);
            return translatedError;
          }),
        );

        resBody['message'] = translatedErrors.join(', ');
      } else {
        const translatedError = await this.getErrorMessage(
          firstErrorMessage['message'],
        );
        resBody['message'] = translatedError;
      }
      resBody['statusCode'] = status;
    } else if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const message = await this.getErrorMessage('error.internalServerError');
      resBody['message'] = message;
      resBody['statusCode'] = status;
    } else {
      const message = await this.getErrorMessage(exception.message);
      resBody['message'] = message;
      resBody['statusCode'] = status;
    }
    httpAdapter.reply(ctx.getResponse<Response>(), resBody, status);
  }

  private async getErrorMessage(key: string): Promise<string> {
    return this.i18nService.translate(key);
  }
}
