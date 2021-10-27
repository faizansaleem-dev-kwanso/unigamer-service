import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import MongoAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Notification.name,
        useFactory: () => {
          const schema = NotificationSchema;
          schema.plugin(MongoAggregatePaginate);
          return schema;
        },
      },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
