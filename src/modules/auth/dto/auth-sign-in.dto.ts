import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthSignInDto {
  @ApiProperty({
    description: 'Email address for login',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Password for login',
  })
  @IsString()
  password: string;
}
