import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';
import { Comment } from '../../../modules/comments/entities/comment.entity';
import { User } from '../../../modules/users/entities/user.entity';

@Schema({ timestamps: true })
export class Reply extends Document {
  @Prop({ required: true, ref: User.name, type: SchemaTypes.ObjectId })
  owner: Types.ObjectId;

  @Prop({ required: true, ref: Comment.name, type: SchemaTypes.ObjectId })
  parent: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  body: string;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: User.name,
  })
  likedBy: Types.ObjectId[];
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
