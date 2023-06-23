import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const emailConfig = configService.get('email');
        return {
          transport: {
            host: emailConfig.host,
            port: emailConfig.port,
            ignoreTLS: true,
            secure: false,
            auth: {
              user: emailConfig.user,
              pass: emailConfig.password,
            },
          },
          defaults: {
            from: `"No Reply" <${process.env.EMAIL_FROM}>`,
          },
          template: {
            dir: process.cwd() + '/src/email/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class EmailModule {}
