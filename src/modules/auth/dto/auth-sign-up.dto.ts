import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthSignUpDto {
  @ApiProperty({ description: 'Username for user' })
  @IsString()
  readonly username: string;

  @ApiProperty({ description: 'City of user' })
  @IsString()
  readonly city: string;

  @ApiProperty({ description: 'Country of user' })
  @IsString()
  readonly country: string;

  @ApiProperty({ description: 'Eamil for user' })
  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiProperty({ description: 'Password for user' })
  @IsString()
  readonly password: string;
}
