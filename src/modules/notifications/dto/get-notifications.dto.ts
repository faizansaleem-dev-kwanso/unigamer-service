import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetNotificationsDto {
  @ApiProperty({
    description: 'Page number for the notifications',
  })
  @IsOptional()
  @IsString()
  page: number;

  @ApiProperty({
    description: 'Limit number of notifications returned',
  })
  @IsOptional()
  @IsString()
  limit: number;

  //   @IsOptional()
  //   @IsString()
  //   filter: string;

  //   @IsOptional()
  //   @IsIn(['popularity', 'rating', 'newest'])
  //   sortBy: string;
}
