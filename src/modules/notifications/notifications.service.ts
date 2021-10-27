import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { PaginateOptions, Model, AggregatePaginateModel } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: AggregatePaginateModel<Notification>,
  ) {}

  create(createNotificationDto: CreateNotificationDto, user: User) {
    const notification = new this.notificationModel({
      ...createNotificationDto,
      sender: user._id,
    });
    return notification.save();
  }

  findAll(getNotificationsDto: GetNotificationsDto, user: User) {
    const { page = 1, limit = 10 } = getNotificationsDto;
    const aggregate = this.notificationModel.aggregate([
      {
        $match: { recipient: new ObjectId(user._id) },
      },
    ]);
    const sort = { isRead: 1, createdAt: -1 };
    const options: PaginateOptions = {
      page: page,
      limit: limit,
      populate: 'sender sourceId',
      sort,
      customLabels: {
        docs: 'notifications',
      },
    };
    return this.notificationModel.aggregatePaginate(aggregate, options);
  }

  findOne(id: string, user: User) {
    return this.notificationModel.findOne({ _id: id, recipient: user._id });
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto, user: User) {
    return this.notificationModel.findOneAndUpdate(
      { recipient: user._id, _id: id },
      { ...updateNotificationDto },
      { new: true },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
