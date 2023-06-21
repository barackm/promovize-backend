import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/controllers/auth/auth.controller';
import {
  I18nModule,
  QueryResolver,
  AcceptLanguageResolver,
  I18nContext,
} from 'nestjs-i18n';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import * as path from 'path';
import config from './config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    DatabaseModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, I18nContext],
})
export class AppModule {}
