import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetGamesDto {
  @ApiProperty({
    description: 'Page number for the games',
  })
  @IsOptional()
  @IsString()
  page: number;

  @ApiProperty({
    description: 'Limit number of games returned',
  })
  @IsOptional()
  @IsString()
  limit: number;

  @IsOptional()
  @IsString()
  filter: string;

  @IsOptional()
  @IsIn(['popularity', 'rating', 'newest'])
  @IsString()
  sortBy: string;
}
