import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';
import { Game } from '../../../modules/games/entities/game.entity';
import { User } from '../../../modules/users/entities/user.entity';

@Schema({
  timestamps: true,
})
export class Review extends Document {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  owner: string;

  @Prop({
    required: true,
    ref: Game.name,
    type: SchemaTypes.ObjectId,
  })
  game: Types.ObjectId;

  @Prop({
    required: true,
  })
  rating: number;

  @Prop({
    required: true,
    enum: ['positive', 'neutral', 'negative'],
  })
  experience: string;

  @Prop({
    required: true,
    enum: ['easy', 'normal', 'hard'],
  })
  difficulty: string;

  @Prop({
    required: true,
    enum: ['<24h', '>24h', '>100h'],
  })
  hoursPlayed: string;

  @Prop({
    required: true,
  })
  body: string;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: User.name,
  })
  likedBy: Types.ObjectId[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
