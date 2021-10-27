import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../../../mail/mail.service';
import { USER_CREATED } from '../constants';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
export class UserCreatedListener {
  constructor(private mailService: MailService) {}
  @OnEvent(USER_CREATED)
  handleUserCreatedEvent(event: UserCreatedEvent) {
    // handle and process "UserCreated" event
    this.mailService.sendUserConfirmation(event.user);
  }
}
