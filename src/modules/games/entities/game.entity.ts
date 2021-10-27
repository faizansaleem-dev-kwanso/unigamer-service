import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({
  timestamps: true,
  autoIndex: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Game extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  description: string;

  @Prop({
    default: [],
  })
  consoles: string[];

  @Prop({
    required: true,
  })
  publisher: string;

  @Prop({
    required: true,
    type: [String],
  })
  genre: string[];

  @Prop({
    required: true,
    type: SchemaTypes.Date,
  })
  releaseDate: Date;

  @Prop()
  pegiUrl: string;

  @Prop()
  coverUrl: string;

  @Prop({
    default: [],
  })
  media: string[];

  @Prop({
    default: 0,
  })
  metaScore: number;

  @Prop()
  metaScoreUrl: string;

  @Prop({
    default: 0,
  })
  ignScore: number;

  @Prop()
  ignScoreUrl: string;

  @Prop({
    default: 0,
  })
  igdbScore: number;

  @Prop()
  igdbScoreUrl: string;

  @Prop()
  videoUrl: string;

  @Prop({
    select: false,
  })
  isSponsored: boolean;

  @Prop()
  adBanner: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);

// GameSchema.virtual('popularityScore', {
//   ref: 'reviews',
//   localField: '_id',
//   foreignField: 'game',
// });

GameSchema.virtual('followers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'followee',
});

// GameSchema.virtual('followersCount', {
//   ref: 'Follow',
//   localField: '_id',
//   foreignField: 'followee',
//   count: true,
// });
