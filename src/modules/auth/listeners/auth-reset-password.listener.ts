import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../../../mail/mail.service';
import { USER_PASSWORD_RESET } from '../../users/constants';
import { UserPasswordResetEvent } from '../events/user-password-reset.event';

@Injectable()
export class AuthEventListener {
  constructor(private mailService: MailService) {}
  @OnEvent(USER_PASSWORD_RESET)
  handlePasswordResetEvent(event: UserPasswordResetEvent) {
    // handle and process "UserCreated" event
    this.mailService.sendResetPasswordEmail(event.user);
  }
}
