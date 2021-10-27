import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';

@Schema({
  timestamps: true,
})
export class Notification extends Document {
  @Prop({
    required: true,
    enum: [
      'POST_LIKE',
      'POST_COMMENT',
      'COMMENT_LIKE',
      'COMMENT_REPLY',
      'REPLY_LIKE',
      'USER_FOLLOW',
    ],
  })
  type: string;

  @Prop()
  body: string;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    refPath: 'sourceType',
  })
  sourceId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['Post', 'Game', 'User', 'Comment', 'Reply'],
  })
  sourceType: string;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  recipient: Types.ObjectId;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  sender: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  link: string;

  @Prop({
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    default: false,
  })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.virtual('senderUser', {
  ref: 'User',
  localField: 'sender',
  foreignField: '_id',
});
