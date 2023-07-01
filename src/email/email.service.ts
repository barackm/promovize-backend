import { HttpException, Injectable } from '@nestjs/common';
import {
  SESClient,
  SendTemplatedEmailCommand,
  SendEmailCommand,
} from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
interface EmailData {
  to: string;
  templateName: string;
  context: any;
}
@Injectable()
export class EmailService {
  private sesClient: SESClient;

  constructor(private readonly configService: ConfigService) {
    const awsConfig = this.configService.get('aws');
    this.sesClient = new SESClient({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  async sendEmail({ to, templateName, context }: EmailData): Promise<void> {
    const emailConfig = this.configService.get('email');
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Template: templateName,
      TemplateData: JSON.stringify(context),
      Source: emailConfig.from,
    };

    try {
      const command = new SendTemplatedEmailCommand(params);
      await this.sesClient.send(command);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async sendRawEmail({ to, subject, body }: any): Promise<void> {
    const emailConfig = this.configService.get('email');
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: emailConfig.from,
    };

    try {
      const command = new SendEmailCommand(params);
      await this.sesClient.send(command);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async sendEmailVerificationEmail(
    user: any,
    token: string,
    prefix: string,
  ): Promise<void> {
    const frontendConfig = this.configService.get('frontend');
    const deepLink = `${prefix || frontendConfig.deepLinkUrl}?token=${token}`;
    try {
      await this.sendEmail({
        to: user.email,
        templateName: 'email-verification',
        context: {
          name: user.email,
          verificationLink: deepLink,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async sendPasswordResetEmail(
    user: any,
    token: string,
    prefix: string,
  ): Promise<void> {
    const frontendConfig = this.configService.get('frontend');
    const deepLink = `${prefix || frontendConfig.deepLinkUrl}?token=${token}`;
    try {
      await this.sendEmail({
        to: user.email,
        templateName: 'reset-password',
        context: {
          name: `${user.firstName || user.email} 👋`,
          resetPasswordLink: deepLink,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async sendGooglePasswordCreationEmail(
    user: any,
    token: string,
    prefix: string,
  ): Promise<void> {
    const frontendConfig = this.configService.get('frontend');
    const deepLink = `${prefix || frontendConfig.deepLinkUrl}?token=${token}`;
    try {
      await this.sendEmail({
        to: user.email,
        templateName: 'google-password-creation',
        context: {
          name: `${user.firstName || user.email} 👋`,
          resetPasswordLink: deepLink,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
