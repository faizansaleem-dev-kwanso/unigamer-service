import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class UpdateUsersSocialDto {
  @ApiProperty({
    description: 'Steam url',
  })
  @IsOptional()
  steam: string;

  @ApiProperty({
    description: 'youtube url',
  })
  @IsOptional()
  youtube: string;

  @ApiProperty({
    description: 'discord url',
  })
  @IsOptional()
  discord: string;

  @ApiProperty({
    description: 'twitch url',
  })
  @IsOptional()
  twitch: string;

  @ApiProperty({
    description: 'reddit url',
  })
  @IsOptional()
  reddit: string;
}
