import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoParser from 'mongodb-query-parser';
import { PaginateModel, PaginateOptions } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: PaginateModel<Comment>,
  ) {}
  async create(createCommentDto: CreateCommentDto, user: User) {
    const comment = new this.commentModel({
      ...createCommentDto,
      owner: user._id,
    });
    const commentResponse = await comment.save();
    return this.commentModel.populate(commentResponse, [
      {
        path: 'owner',
        model: User.name,
      },
    ]);
  }

  findAll(getCommentsDto: GetCommentsDto) {
    const { filter = {} } = getCommentsDto;
    const query = mongoParser(filter);
    const options: PaginateOptions = {
      pagination: false,
      populate: ['owner'],
      customLabels: {
        docs: 'comments',
      },
    };
    const posts = this.commentModel.paginate(query, options);
    return posts;
  }

  findOne(_id: string) {
    return this.commentModel.findOne({ _id });
  }

  update(_id: string, updateCommentDto: UpdateCommentDto, user: User) {
    return this.commentModel.findOneAndUpdate(
      { _id, owner: user._id },
      { ...updateCommentDto },
      { new: true },
    );
  }

  async remove(_id: string, user: User) {
    await this.commentModel.deleteOne({ _id, owner: user._id });
  }

  like(_id: string, user: User) {
    return this.commentModel.updateOne(
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
    return this.commentModel.updateOne(
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
