import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document, Types } from 'mongoose';
import { Game } from '../../../modules/games/entities/game.entity';
import { User } from '../../../modules/users/entities/user.entity';

@Schema({
  timestamps: true,
})
export class Post extends Document {
  @Prop({
    required: true,
    ref: User.name,
    type: SchemaTypes.ObjectId,
  })
  owner: Types.ObjectId;

  @Prop({
    type: String,
    enum: [User.name, Game.name],
    required: true,
  })
  postedToType: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    refPath: 'postedToType',
    required: true,
  })
  postedTo: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  body: string;

  @Prop({
    type: String,
  })
  videoUrl: string;

  @Prop({
    type: String,
  })
  imageUrl: string;

  @Prop({
    default: false,
    select: false,
  })
  isSponsored: boolean;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: User.name,
  })
  likedBy: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
