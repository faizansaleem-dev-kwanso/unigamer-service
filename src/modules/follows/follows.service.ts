import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions } from 'mongoose';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowDto } from './dto/follow-user.dto';
import { GetFollowersDto } from '../users/dto/get-followers.dto';
import { UnfollowDto } from './dto/unfollow-user.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name)
    private readonly followModel: PaginateModel<Follow>,
  ) {}

  create(createFollowDto: CreateFollowDto) {
    return 'This action adds a new follow';
  }

  async findAll(getFollowersDto: GetFollowersDto, id: string) {
    const { page } = getFollowersDto;
    const options: PaginateOptions = {
      page,
      populate: ['follower'],
      customLabels: {
        docs: 'followers',
      },
    };
    const followers = await this.followModel.paginate(
      {
        followee: id,
      },
      options,
    );
    return followers;
  }

  findOne(id: number) {
    return `This action returns a #${id} follow`;
  }

  update(id: number, updateFollowDto: UpdateFollowDto) {
    return `This action updates a #${id} follow`;
  }

  remove(id: number) {
    return `This action removes a #${id} follow`;
  }

  async follow(followDto: FollowDto) {
    const userFollow = new this.followModel({ ...followDto });
    return await userFollow.save().catch((err) => {
      if (err.code && err.code === 11000) {
        throw new BadRequestException("You're already following this user!");
      }
    });
  }

  async unfollow(unfollowDto: UnfollowDto) {
    await this.followModel.deleteOne({
      ...unfollowDto,
    });
  }
}
