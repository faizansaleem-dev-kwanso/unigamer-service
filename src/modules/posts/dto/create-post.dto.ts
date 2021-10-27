import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @ApiProperty({
    description: "Post type can either be 'User'  or 'Game' ",
  })
  @IsString()
  postedToType: string;

  @ApiProperty({
    description: 'ID of the user or game to which this post will be posted',
  })
  @IsMongoId()
  postedTo: string;

  @ApiProperty({
    description: 'Text body of the user',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Video URL for the video in post',
  })
  @IsOptional()
  @IsUrl()
  videoUrl: string;

  @ApiProperty({
    description: 'Image url for the image in post',
  })
  @IsOptional()
  @IsUrl()
  imageUrl: string;
}
