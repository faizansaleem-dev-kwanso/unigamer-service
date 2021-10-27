import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID of the post',
  })
  @IsMongoId()
  parent: Types.ObjectId;

  @ApiProperty({
    description: 'Comment body',
  })
  @IsString()
  body: string;
}
