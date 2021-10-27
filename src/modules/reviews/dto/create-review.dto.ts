import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Game ID for review',
  })
  @IsMongoId()
  game: string;

  @IsString()
  body: string;

  @ApiProperty({
    description: 'rating for review',
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'experience for review',
  })
  @IsIn(['positive', 'neutral', 'negative'])
  experience: string;

  @ApiProperty({
    description: 'difficulty for review eg: "easy" ',
  })
  @IsIn(['easy', 'normal', 'hard'])
  difficulty: string;

  @ApiProperty({
    description: 'hours played in game for review',
  })
  @IsIn(['<24h', '>24h', '>100h'])
  hoursPlayed: string;
}
