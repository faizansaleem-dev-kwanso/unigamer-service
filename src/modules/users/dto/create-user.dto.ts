import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the account',
  })
  readonly username: string;

  @ApiProperty({
    description: 'City name for the user profile',
  })
  readonly city: string;

  @ApiProperty({
    description: 'Country name for the user profile',
  })
  readonly country: string;

  @ApiProperty({
    description: 'Email for the account',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Password for the account',
  })
  readonly password: string;

  @ApiHideProperty()
  readonly token: string;

  @ApiProperty({
    description: 'Sub for the account',
  })
  readonly sub: string;

  @ApiProperty({
    description: 'Email verification flag for the account',
  })
  readonly email_verified: boolean;
}
