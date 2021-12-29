import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User } from './entities/user.entity';
import { UserCreatedEvent } from './events/user-created.event';
import { MailService } from '../../mail/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  PaginateOptions,
  PaginateModel,
  AggregatePaginateModel,
} from 'mongoose';
import _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { GetUsersDto } from './dto/get-users.dto';
import { FollowService } from '../follows/follows.service';
import { GetFollowersDto } from './dto/get-followers.dto';
import { UpdateUsersSocialDto } from './dto/update-users-social.dto';
import { ObjectId } from 'mongodb';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: AggregatePaginateModel<User>,
    private followService: FollowService,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { city, country, ...userInfo } = createUserDto;
    const user = new this.userModel({
      ...userInfo,
      profile: { city, country },
    });
    const createdUser = await user.save();
    const userCreatedEvent = new UserCreatedEvent();
    userCreatedEvent.user = createdUser;
    // FIXME: Move the email sending JOB to SQS and consume via another Lambda email consumer
    // await this.mailService.sendUserConfirmation(createdUser);
    return createdUser.toObject();
  }

  async findAll(getUsersDto: GetUsersDto) {
    const { page, sortBy, limit: queryLimit } = getUsersDto;

    let sort: Record<string, any> = { username: 1 };
    let limit = 10;
    if (queryLimit) {
      limit = +queryLimit;
    }
    if (sortBy) {
      sort = { [sortBy]: -1 };
    }
    const options: PaginateOptions = {
      page,
      sort,
      limit,
      customLabels: {
        docs: 'users',
      },
    };
    const aggregate = this.userModel.aggregate([
      {
        $lookup: {
          from: 'follows',
          as: 'followerUsers',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$followee', '$$id'],
                    },
                    {
                      $eq: ['$onFollowerModel', 'User'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'follows',
          as: 'followingUsers',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$follower', '$$id'],
                    },
                    {
                      $eq: ['$onFolloweeModel', 'User'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'follows',
          as: 'followingGames',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$follower', '$$id'],
                    },
                    {
                      $eq: ['$onFolloweeModel', 'Game'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'owner',
          as: 'reviews',
        },
      },
      {
        $project: {
          email: 1,
          username: 1,
          profile: 1,
          social: 1,
          consoles: 1,
          followerUsers: {
            $map: {
              input: '$followerUsers',
              as: 'user',
              in: '$$user.follower',
            },
          },
          followingUsers: {
            $map: {
              input: '$followingUsers',
              as: 'user',
              in: '$$user.follower',
            },
          },
          followingGames: {
            $map: {
              input: '$followingGames',
              as: 'user',
              in: '$$user.follower',
            },
          },
          reviewsCount: {
            $size: '$reviews',
          },
        },
      },
    ]);
    const users = await this.userModel.aggregatePaginate(aggregate, options);
    return users;
  }

  async search(query: string) {
    const options: PaginateOptions = {
      page: 1,
      customLabels: {
        docs: 'users',
      },
    };
    const aggregate = this.userModel.aggregate([
      {
        $match: {
          $text: {
            $search: query,
          },
        },
      },
    ]);
    const users = await this.userModel.aggregatePaginate(aggregate, options);
    return users;
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  findById(_id: string) {
    return this.userModel.findOne({ _id });
  }

  findOneByQuery(options: FilterQuery<User>) {
    return this.userModel.findOne(options);
  }

  findOne(id: string) {
    return this.userModel.findOne(
      { _id: id },
      { password: 0, email: 0, token: 0 },
    );
  }

  updatePrivate(updates: Record<string, any>, user: User) {
    return this.userModel.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        ...updates,
      },
      {
        new: true,
      },
    );
  }

  update(UpdateUserProfileDto: UpdateUserProfileDto, user: User) {
    const updatedProfile = _.extend(user.profile, UpdateUserProfileDto);
    return this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        profile: updatedProfile,
      },
      {
        new: true,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async disconnectUser(_id: string) {
    return this.userModel.updateOne({ _id }, { connected: 0 });
  }

  updateSocial(updateUserSocialDto: UpdateUsersSocialDto, user: User) {
    const updateQuery = {};
    Object.keys(updateUserSocialDto).map((social) => {
      updateQuery[`social.${social}`] = updateUserSocialDto[social];
    });
    return this.userModel.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        $set: { ...updateQuery },
      },
      {
        new: true,
      },
    );
  }

  deleteSocial(name: string, user: User) {
    return this.userModel.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        $set: { [`social.${name}`]: '' },
      },
      {
        new: true,
      },
    );
  }

  async updateConsole(console: string, user: User) {
    const { password, token, ...rest } = await this.userModel.findByIdAndUpdate(
      {
        _id: user._id,
      },
      {
        $addToSet: { consoles: console },
      },
      {
        new: true,
      },
    );
    return rest;
  }
  async deleteConsole(name: string, user: User) {
    const { password, token, ...rest } = await this.userModel.findByIdAndUpdate(
      {
        _id: user._id,
      },
      {
        $pull: { consoles: name },
      },
      {
        new: true,
      },
    );
    return rest;
  }

  async findAllFollowers(getFollowersDto: GetFollowersDto, user: User) {
    return await this.followService.findAll(getFollowersDto, user._id);
  }

  async followUser(followee: string, user: User) {
    return await this.followService.follow({
      followee,
      follower: user._id,
      onFolloweeModel: User.name,
      onFollowerModel: User.name,
    });
  }

  async unFollowUser(followee: string, user: User) {
    await this.followService.unfollow({
      follower: user._id,
      followee,
    });
  }

  async changePassword(changePasswordDto: ChangePasswordDto, user: User) {
    const { oldPassword, newPassword } = changePasswordDto;
    const currentUser = await this.userModel
      .findById(user._id)
      .select('+password')
      .lean();
    if (user && bcrypt.compareSync(oldPassword, currentUser.password)) {
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      await this.userModel.updateOne(
        { _id: user._id },
        { password: hashedPassword },
      );
      return { message: 'Password changed successfully!' };
    }
    throw new UnauthorizedException('Old Password is incorrect!');
  }

  async findUserMeta(id: string) {
    /**
     * - total followersCount
     * - total followingCount (users)
     * - total game reviews
     * - total number of games Following
     */
    const userMeta = await this.userModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'follows',
          as: 'followerUsers',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$followee', '$$id'],
                    },
                    {
                      $eq: ['$onFollowerModel', 'User'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'follows',
          as: 'followingUsers',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$follower', '$$id'],
                    },
                    {
                      $eq: ['$onFolloweeModel', 'User'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'follows',
          as: 'followingGames',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$follower', '$$id'],
                    },
                    {
                      $eq: ['$onFolloweeModel', 'Game'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'owner',
          as: 'reviews',
        },
      },
      {
        $project: {
          followerUsers: {
            $map: {
              input: '$followerUsers',
              as: 'user',
              in: '$$user.follower',
            },
          },
          followingUsers: {
            $map: {
              input: '$followingUsers',
              as: 'user',
              in: '$$user.follower',
            },
          },
          followingGames: {
            $map: {
              input: '$followingGames',
              as: 'user',
              in: '$$user.follower',
            },
          },
          reviewsCount: {
            $size: '$reviews',
          },
        },
      },
    ]);
    return userMeta[0];
  }
}
