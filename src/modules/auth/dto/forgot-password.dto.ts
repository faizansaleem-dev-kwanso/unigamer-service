import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Registered email id of the user' })
  @IsEmail()
  resetemail: string;
}
