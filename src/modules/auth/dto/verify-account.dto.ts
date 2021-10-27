import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class VerifyAccountDto {
  @ApiProperty({ description: 'Account verification token' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'Unique User ID' })
  @IsMongoId({
    message: 'Invalid user ID in url',
  })
  id: string;
}
