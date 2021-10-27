import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Game } from '../../../modules/games/entities/game.entity';
import { User } from '../../../modules/users/entities/user.entity';

@Schema({
  timestamps: true,
})
export class Follow extends Document {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    refPath: 'onFollowerModel',
  })
  follower: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    enum: [User.name, Game.name],
  })
  onFollowerModel: string;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    refPath: 'onFolloweeModel',
  })
  followee: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    enum: [User.name, Game.name],
  })
  onFolloweeModel: string;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
FollowSchema.index({ follower: 1, followee: 1 }, { unique: true });
