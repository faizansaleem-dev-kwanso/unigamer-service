import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class GetRepliesDto {
  @ApiProperty({
    description: 'Page number for the replies',
  })
  @IsString()
  page: number;

  @ApiProperty({
    description: 'Parent filter for comments',
  })
  @IsOptional()
  @IsMongoId()
  parent: Types.ObjectId;

  @ApiProperty({
    description: 'limit for the replies',
  })
  @IsOptional()
  @IsString()
  limit: number;
}
