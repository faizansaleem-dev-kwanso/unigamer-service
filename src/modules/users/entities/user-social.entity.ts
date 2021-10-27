import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserSocial {
  @Prop({
    default: '',
  })
  reddit: string;

  @Prop({
    default: '',
  })
  twitch: string;

  @Prop({
    default: '',
  })
  youtube: string;

  @Prop({
    default: '',
  })
  discord: string;

  @Prop({
    default: '',
  })
  steam: string;
}

export const userSocialSchema = SchemaFactory.createForClass(UserSocial);
