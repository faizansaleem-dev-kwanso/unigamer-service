import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            port: 465,
            host: configService.get<string>('MAILING_SMTP_HOST'),
            secure: true,
            auth: {
              user: configService.get<string>('MAILING_SMTP_USERNAME'),
              pass: configService.get<string>('MAILING_SMTP_PASSWORD'),
            },
            debug: true,
          },
          defaults: {
            from: `"No Reply" <${configService.get<string>(
              'SENDER_EMAIL_ADDRESS',
            )}>`,
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
