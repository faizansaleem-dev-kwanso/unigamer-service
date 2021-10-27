import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token' })
  @IsString()
  @IsNotEmpty({
    message: 'Token cannot be empty',
  })
  token: string;

  @ApiProperty({ description: 'Unique User ID' })
  @IsMongoId({ message: 'Invalid ID' })
  id: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  password: string;
}
