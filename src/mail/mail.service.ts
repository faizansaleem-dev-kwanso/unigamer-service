import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getPathForImage, getPathForTemplate } from '../utils/pathHelper';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmation(user: User) {
    const link = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/auth/verify?token=${user.token}&id=${user._id}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Please confirm your Email account',
      text: `Please verify here: ${link}`,
      template: getPathForTemplate(
        'verification',
        this.configService.get<string>('EXECUTION_CONTEXT'),
      ),
      context: {
        // ✏️ filling curly brackets with content
        link,
      },
      attachments: [
        {
          filename: 'maillogo.png',
          cid: 'logo',
          path: getPathForImage(
            'maillogo.png',
            this.configService.get<string>('EXECUTION_CONTEXT'),
          ),
        },
      ],
    });
  }

  async sendResetPasswordEmail(user: User) {
    const link = `${this.configService.get<string>(
      'FRONTEND_URL',
    )}/auth/reset-password?token=${user.token}&id=${user._id}`;
    const res = await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      text: `We have received your request for reseting your password`,
      template: getPathForTemplate(
        'resetPassword',
        this.configService.get<string>('EXECUTION_CONTEXT'),
      ),
      context: {
        // ✏️ filling curly brackets with content
        link,
      },
      attachments: [
        {
          filename: 'maillogo.png',
          cid: 'logo',
          path: getPathForImage(
            'maillogo.png',
            this.configService.get<string>('EXECUTION_CONTEXT'),
          ),
        },
      ],
    });
  }
}
