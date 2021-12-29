import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { MailService } from '../../mail/mail.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: User = await this.userService
      .findByEmail(email)
      .select('+password +active');

    if (user && bcrypt.compareSync(password, user.password)) {
      if (user && user.active !== 1) {
        throw new UnauthorizedException(
          'Email verification pending! Please check your email for a verification link.',
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, token, ...rest } = user;
      return rest;
    }
    throw new UnauthorizedException(
      'Email address or password is not correct!',
    );
  }

  async signUp(authSignUpDto: AuthSignUpDto) {
    try {
      const { email, username } = authSignUpDto;
      // check if username or email already exisist
      const User = await this.userService.findOneByQuery({
        $or: [{ email }, { username }],
      });
      if (User)
        throw new HttpException(
          'That Email or Username are already taken.',
          HttpStatus.CONFLICT,
        );
      // const hashedPassword = bcrypt.hashSync(authSignUpDto.password, 10);
      // const token = bcrypt.hashSync(`${Date.now}`, bcrypt.genSaltSync(8));
      // const createUserInput: CreateUserDto = {
      //   ...authSignUpDto,
      //   // password: hashedPassword,
      //   // token,
      // };
      // return await this.userService.create(createUserInput);
    } catch (error) {
      console.log('error', error);
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { resetemail: email } = forgotPasswordDto;
    const user = await this.userService.findOneByQuery({ email, active: 1 });
    // TODO: need to check for the flash implementation
    if (!user)
      throw new NotFoundException('User is not registered or activated.');
    const token = bcrypt.hashSync(Date.now.toString(), bcrypt.genSaltSync(8));
    await this.userService.updatePrivate({ token }, user);
    user.token = token;
    // FIXME: Move the email sending JOB to SQS and consume via another Lambda email consumer
    await this.mailService.sendResetPasswordEmail(user);
    return {
      message: 'We have sent you a reset link. Please check your inbox!',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, id: _id, password } = resetPasswordDto;
    const user = await this.userService
      .findOneByQuery({
        token,
        _id,
      })
      .select('+token');

    // TODO: check if flash message can be integrated
    if (!user)
      throw new UnauthorizedException(
        'Reset Token has expired or do not exist. Please try again.',
      );

    const hashedPassword = bcrypt.hashSync(password, 10);
    await this.userService.updatePrivate({ password: hashedPassword }, user);
    return { message: 'Passsword reset successfull!' };
  }

  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    const { token, id: _id } = verifyAccountDto;
    const user = await this.userService.findOneByQuery({ token, _id });
    // TODO: check if flash message can be integrated
    if (!user)
      throw new UnauthorizedException('Token does not exist or is expired.');
    await this.userService.updatePrivate({ active: 1 }, user);
    return { message: 'Account verification successful!' };
  }

  async logout(req: Request, user: User) {
    req.logout();
    await this.userService.disconnectUser(user._id);
    return { message: 'Logout successfull!' };
  }
}
