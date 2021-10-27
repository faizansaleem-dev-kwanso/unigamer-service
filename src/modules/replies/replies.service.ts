import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateOptions, PaginateModel } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { CreateReplyDto } from './dto/create-reply.dto';
import { GetRepliesDto } from './dto/get-replies.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';

@Injectable()
export class RepliesService {
  constructor(
    @InjectModel(Reply.name) private readonly replyModel: PaginateModel<Reply>,
  ) { }
  async create(createReplyDto: CreateReplyDto, user: User) {
    const reply = new this.replyModel({
      ...createReplyDto,
      owner: user._id,
    });
    const replyResponse = await reply.save();
    return this.replyModel.populate(replyResponse, [
      {
        path: 'owner',
        model: User.name,
      },
    ]);
  }

  findAll(getRepliesDto: GetRepliesDto) {
    const { page, limit = 10, parent } = getRepliesDto;
    const filter = { parent }
    const options: PaginateOptions = {
      limit,
      page: page,
      populate: ['owner'],
      customLabels: {
        docs: 'replies',
      },
    };
    return this.replyModel.paginate(filter, options);
  }

  findOne(_id: string) {
    return this.replyModel.findOne({ _id });
  }

  update(_id: string, updateReplyDto: UpdateReplyDto, user: User) {
    return this.replyModel.findOneAndUpdate(
      { _id, owner: user._id },
      { ...updateReplyDto },
      { new: true },
    );
  }

  async remove(_id: string, user: User) {
    await this.replyModel.deleteOne({ _id, owner: user._id });
  }

  like(_id: string, user: User) {
    return this.replyModel.updateOne(
      { _id },
      {
        $addToSet: {
          likedBy: user._id,
        },
      },
      {
        new: true,
      },
    );
  }

  unlike(_id: string, user: User) {
    return this.replyModel.updateOne(
      { _id },
      {
        $pull: {
          likedBy: user._id,
        },
      },
      {
        new: true,
      },
    );
  }
}
