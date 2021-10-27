import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document, Types } from 'mongoose';
import { Post } from '../../../modules/posts/entities/post.entity';
import { User } from '../../../modules/users/entities/user.entity';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true, ref: User.name, type: SchemaTypes.ObjectId })
  owner: Types.ObjectId;

  @Prop({ required: true, ref: Post.name, type: SchemaTypes.ObjectId })
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

export const CommentSchema = SchemaFactory.createForClass(Comment);
