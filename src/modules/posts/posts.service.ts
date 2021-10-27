import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions } from 'mongoose';
import mongoParser from 'mongodb-query-parser';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: PaginateModel<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    const post = new this.postModel({ owner: user._id, ...createPostDto });
    const postResponse = await post.save();
    return this.postModel.populate(postResponse, [
      { path: 'owner', model: 'User' },
      { path: 'postedTo', model: createPostDto.postedToType },
    ]);
  }

  async findAll(getPostDto: GetPostsDto) {
    const { page = 1, filter = '{}', limit = 10 } = getPostDto;
    const query = mongoParser(filter);
    const options: PaginateOptions = {
      page: page,
      limit: limit,
      populate: ['postedTo', 'owner', 'likedBy'],
      sort: { createdAt: -1 },
      customLabels: {
        docs: 'posts',
      },
    };
    const posts = await this.postModel.paginate(query, options);
    return posts;
  }

  async search(query: string) {
    const options: PaginateOptions = {
      page: 1,
      customLabels: {
        docs: 'posts',
      },
      populate: ['owner'],
    };
    const posts = await this.postModel.paginate(
      { $text: { $search: query } },
      options,
    );
    return posts;
  }

  async findOne(_id: string) {
    const post = await this.postModel
      .findOne({ _id })
      .lean()
      .populate('postedTo likedBy owner');
    if (!post) throw new NotFoundException(`Post with ID:${_id} not found`);
    return post;
  }

  update(_id: string, updatePostDto: UpdatePostDto, user: User) {
    return this.postModel.findOneAndUpdate(
      { _id, owner: user._id },
      { ...updatePostDto },
      { new: true },
    );
  }

  async remove(_id: string, user: User) {
    await this.postModel.deleteOne({ _id, owner: user._id });
  }

  like(_id: string, user: User) {
    return this.postModel.findOneAndUpdate(
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
    return this.postModel.findOneAndUpdate(
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
