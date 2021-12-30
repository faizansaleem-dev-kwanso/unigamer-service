import {
  Controller,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Req,
  Body,
  Get,
  Res,
  Param,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { Unauthorized } from './filters/auth.filter';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginGuard } from './guards/login.guard';
import { Authorized } from './interceptors/auth.interceptor';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { ReqUser } from '../../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

interface IUserRequest extends Request {
  user: {
    email: string;
    _id: string;
    email_verified: boolean;
  };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LoginGuard)
  @UseFilters(Unauthorized)
  @UseInterceptors(Authorized)
  login(@Body() _authSignInDto: AuthSignInDto) {
    return { message: 'Login Successfull!' };
  }

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  async getUser(@Req() request: IUserRequest) {
    const {
      user: { _id },
    } = request;
    return this.userService.findById(_id);
  }

  @Post('signup')
  create(@Body() authSignUpDto: AuthSignUpDto) {
    return this.authService.signUp(authSignUpDto);
  }

  @Post('forgot')
  forgot(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('verify')
  verify(@Query() verifyAccountDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verifyAccountDto);
  }

  @Post('reset')
  reset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('logout')
  @ApiCookieAuth()
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request, @ReqUser() user) {
    return this.authService.logout(req, user);
  }
}
