import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetFollowersDto {
  @ApiProperty({
    description: 'Page number for the followers',
  })
  @IsString()
  page: number;
}
