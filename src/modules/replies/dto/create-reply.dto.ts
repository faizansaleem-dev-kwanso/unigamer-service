import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReplyDto {
  @ApiProperty({
    description: 'ID of the Comment',
  })
  @IsMongoId()
  parent: Types.ObjectId;

  @ApiProperty({
    description: 'Reply body',
  })
  @IsString()
  body: string;
}
