import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { userProfileSchema, UserProfile } from './user-profile.entity';
import { UserSocial, userSocialSchema } from './user-social.entity';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    index: true,
    unique: true,
  })
  username: string;

  @Prop({
    index: true,
    unique: true,
  })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ type: userProfileSchema })
  profile: UserProfile;

  @Prop({ type: userSocialSchema, default: () => ({}) })
  social: UserSocial;

  @Prop({ type: [String], enum: ['ps4', 'xbox', 'switch', 'pc'], default: [] })
  consoles: string[];

  @Prop({ select: false })
  token: string;

  @Prop({ default: 0, select: false })
  active: number;

  @Prop()
  blogger: number;

  @Prop()
  connected: number;

  @Prop()
  sub: string;

  @Prop()
  email_verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
// UserSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function () {
//   this.lean();
// });

UserSchema.virtual('followers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'followee',
});
