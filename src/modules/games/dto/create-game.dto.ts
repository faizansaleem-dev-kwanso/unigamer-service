import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGameDto {
  @ApiProperty({
    description: 'Name of the game',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description for the game',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Genre of the game',
  })
  @IsArray()
  genre: string[];

  @ApiProperty({
    description: 'Publisher of the game',
  })
  @IsString()
  publisher: string;

  @ApiProperty({
    description: 'Game release date',
  })
  @IsDateString()
  releaseDate: Date;

  @ApiProperty({
    description: 'Cover Image URL for the game',
  })
  @IsString()
  @IsOptional()
  coverUrl: string;

  @ApiProperty({
    description: 'Video URL for the game',
  })
  @IsString()
  @IsOptional()
  videoUrl: string;

  @ApiProperty({
    description: 'Metascore for the game',
  })
  @IsNumber()
  @IsOptional()
  metaScore: number;

  @ApiProperty({
    description: 'Metascore URL for the game',
  })
  @IsString()
  @IsOptional()
  metaScoreUrl: string;

  @ApiProperty({
    description: 'IGN Score for the game',
  })
  @IsNumber()
  @IsOptional()
  ignScore: number;

  @ApiProperty({
    description: 'IGN URL for the game',
  })
  @IsString()
  @IsOptional()
  ignScoreUrl: string;

  @ApiProperty({
    description: 'IGDB Score for the game',
  })
  @IsNumber()
  @IsOptional()
  igdbScore: number;

  @ApiProperty({
    description: 'IGDB URL for the game',
  })
  @IsString()
  @IsOptional()
  igdbScoreUrl: string;

  @ApiProperty({
    description: 'PEGI image URL for the game',
  })
  @IsString()
  @IsOptional()
  pegiUrl: string;

  @ApiProperty({
    description: 'Is game sponsored status',
  })
  @IsBoolean()
  @IsOptional()
  isSponsored: boolean;

  @ApiProperty({
    description: 'Banner image for game',
  })
  @IsString()
  @IsOptional()
  adBanner: string;
}
