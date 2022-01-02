import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthenticatedGuard extends AuthGuard('local') {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization.split(' ')[1];
    try {
      const response = await axios.get(
        `https://${this.configService.get<string>('AUTH0_DOMAIN')}/userinfo`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const { email, nickname, sub, email_verified } = response.data;
      const result = await this.userService.findByEmail(email);
      if (result && result.email_verified !== email_verified) {
        await this.userService.updateEmailVerify(email_verified, email);
      }
      let createdUser = null;
      if (!result) {
        createdUser = await this.userService.create({
          username: nickname,
          email: email,
          city: '',
          country: '',
          password: '',
          token: '',
          sub: sub,
          email_verified: email_verified,
        });
      }
      request.user = result
        ? result
        : {
            _id: createdUser ? createdUser._id : result._id,
            email,
            email_verified,
          };
      return true;
    } catch (err) {
      console.log(err, 'ERROR');
    }
  }
}
