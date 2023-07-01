import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './globalFilters/httpException.filter';
import { I18nService } from 'nestjs-i18n';
import { GlobalExceptionFilter } from './globalFilters/globalException.filter';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const i18nService = app.get(I18nService);
  const port = configService.get('app.port') || 8000;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'x-custom-lang',
    ],
  });
  app.useGlobalFilters(
    new HttpExceptionFilter(i18nService, app.get(ConfigService)),
    new GlobalExceptionFilter(
      i18nService,
      app.get(ConfigService),
      app.get(HttpAdapterHost),
      app.get(Logger),
    ),
  );

  const config = new DocumentBuilder()
    .setTitle('Promovize API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
};

bootstrap();
