import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { FAILURE_REDIRECT } from '../contants';

@Catch(UnauthorizedException, ForbiddenException)
export class Unauthorized implements ExceptionFilter {
  @Inject(FAILURE_REDIRECT)
  public failureRedirect: string; // '/login-page'
  catch(
    _exception: ForbiddenException | UnauthorizedException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = _exception.getStatus();
    const message = _exception.message;
    return response.status(status).send({ message });
  }
}
