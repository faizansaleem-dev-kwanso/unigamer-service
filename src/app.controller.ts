import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ReqUser } from './common/decorators/user.decorator';
import { AuthenticatedGuard } from './modules/auth/guards/authenticated.guard';
import { User } from './modules/users/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-authenticated-page')
  @ApiCookieAuth()
  @UseGuards(AuthenticatedGuard)
  test(@ReqUser() user: User): string {
    return `Hi, you're logged In ${user.email} your ID is ${user._id}`;
  }
}
