import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './modules/auth/controllers/auth/auth.controller';
import {
  I18nModule,
  QueryResolver,
  AcceptLanguageResolver,
  I18nContext,
} from 'nestjs-i18n';
import * as path from 'path';
@Module({
  imports: [
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
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, I18nContext],
})
export class AppModule {}
