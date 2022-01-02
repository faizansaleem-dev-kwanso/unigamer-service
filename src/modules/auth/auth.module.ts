import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FAILURE_REDIRECT, SUCCESS_REDIRECT } from './contants';
import { LocalStrategy } from './strategy/local.strategy';
import { SessionSerializer } from './session.seralizer';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../../mail/mail.module';
import { AuthEventListener } from './listeners/auth-reset-password.listener';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [PassportModule, UsersModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: SUCCESS_REDIRECT, useValue: '/' },
    { provide: FAILURE_REDIRECT, useValue: '/login' },
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
    AuthEventListener,
  ],
  exports: [SUCCESS_REDIRECT, FAILURE_REDIRECT],
})
export class AuthModule {}
