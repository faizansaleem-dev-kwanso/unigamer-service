import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class UserProfile {
  @Prop({
    default: '',
  })
  firstname: string;

  @Prop({
    default: '',
  })
  lastname: string;

  @Prop({
    default: '',
  })
  picture: string;

  @Prop({
    default: '',
  })
  company: string;

  @Prop({
    default: '',
  })
  street: string;

  @Prop({
    default: '',
  })
  city: string;

  @Prop({
    default: '',
  })
  zip: string;

  @Prop({
    default: '',
  })
  state: string;

  @Prop({
    default: '',
  })
  country: string;

  @Prop({
    default: '',
  })
  telephone: string;

  @Prop({
    default: '',
  })
  description: string;
}

export const userProfileSchema = SchemaFactory.createForClass(UserProfile);
