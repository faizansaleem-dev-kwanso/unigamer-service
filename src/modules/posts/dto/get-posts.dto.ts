import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetPostsDto {
  @ApiProperty({
    description: 'Page number for the posts',
  })
  @IsOptional()
  @IsString()
  page: number;

  @ApiProperty({
    description: 'Limit number of posts returned',
  })
  @IsOptional()
  @IsString()
  limit: number;

  @IsOptional()
  filter: string;
}
