import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class GetReviewsDto {
  @ApiProperty({
    description: 'Page number for the reviews',
  })
  @IsString()
  page: number;

  @IsString()
  limit: number;

  @ApiProperty({
    description: 'Parent filter for reviews',
  })
  @IsOptional()
  @IsMongoId()
  game: Types.ObjectId;
}
