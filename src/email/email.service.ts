import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  context?: any;
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({
    to,
    subject,
    context,
    template,
  }: EmailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.EMAIL_FROM,
        subject,
        template: template,
        context,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async sendEmailVerificationEmail(user: any, token: string): Promise<void> {
    try {
      const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
      await this.sendEmail({
        to: user.email,
        subject: 'Verify Email',
        context: {
          email: user.email,
          verificationLink,
        },
        template: 'verification',
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
