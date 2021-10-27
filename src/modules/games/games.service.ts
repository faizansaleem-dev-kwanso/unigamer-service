import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateOptions, Model, AggregatePaginateModel } from 'mongoose';
import mongoParser from 'mongodb-query-parser';
import { FollowService } from '../follows/follows.service';
import { User } from '../users/entities/user.entity';
import { AddGameConsoleDto } from './dto/add-game-console.dto';
import { AddGameMediaDto } from './dto/add-game-media.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { DeleteGameConsoleDto } from './dto/delete-game-console.dto';
import { DeleteGameMediaDto } from './dto/delete-game-media.dto';
import { GetFollowersDto } from './dto/get-followers.dto';
import { GetGamesDto } from './dto/get-games.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private readonly gameRegularModel: Model<Game>,
    @InjectModel(Game.name)
    private readonly gameModel: AggregatePaginateModel<Game>,
    private readonly followService: FollowService,
  ) {}

  create(createGameDto: CreateGameDto) {
    const game = new this.gameModel({
      ...createGameDto,
    });
    return game.save();
  }

  suggestions(user: User) {
    return true;
  }

  findAll(getGamesDto: GetGamesDto) {
    const {
      page = 1,
      filter = '{}',
      limit = 10,
      sortBy = 'popularity',
    } = getGamesDto;
    const query = mongoParser(filter);
    const aggregate = this.gameModel.aggregate([
      {
        $match: { ...query },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'followee',
          as: 'followers',
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          consoles: 1,
          publisher: 1,
          genre: 1,
          releaseDate: 1,
          pegiUrl: 1,
          coverUrl: 1,
          media: 1,
          metaScore: 1,
          metaScoreUrl: 1,
          ignScore: 1,
          ignScoreUrl: 1,
          igdbScore: 1,
          igdbScoreUrl: 1,
          videoUrl: 1,
          isSponsored: 1,
          adBanner: 1,
          followers: {
            $map: {
              input: '$followers',
              as: 'user',
              in: '$$user.follower',
            },
          },
        },
      },
      {
        $addFields: {
          followersCount: {
            $size: '$followers',
          },
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'game',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          avreageRating: {
            $avg: '$reviews.rating',
          },
        },
      },
    ]);

    let sort: Record<string, any> = { followersCount: -1 };
    if (sortBy === 'rating') {
      sort = { avreageRating: -1 };
    }
    if (sortBy === 'popularity') {
      sort = { followersCount: -1 };
    }
    if (sortBy === 'newest') {
      sort = { releaseDate: -1 };
    }
    const options: PaginateOptions = {
      page: page,
      limit: limit,
      populate: 'followers followersCount',
      sort,
      customLabels: {
        docs: 'games',
      },
    };
    return this.gameModel.aggregatePaginate(aggregate, options);
  }

  async findOne(_id: string) {
    const games = await this.gameModel.aggregate([
      {
        $match: {
          _id: new ObjectId(_id),
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'followee',
          as: 'followers',
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          consoles: 1,
          publisher: 1,
          genre: 1,
          releaseDate: 1,
          pegiUrl: 1,
          coverUrl: 1,
          media: 1,
          metaScore: 1,
          metaScoreUrl: 1,
          ignScore: 1,
          ignScoreUrl: 1,
          igdbScore: 1,
          igdbScoreUrl: 1,
          videoUrl: 1,
          isSponsored: 1,
          adBanner: 1,
          followers: {
            $map: {
              input: '$followers',
              as: 'user',
              in: '$$user.follower',
            },
          },
        },
      },
      {
        $addFields: {
          followersCount: {
            $size: '$followers',
          },
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'game',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          avreageRating: {
            $avg: '$reviews.rating',
          },
        },
      },
    ]);
    if (games.length === 0) {
      throw new NotFoundException(`Game with #${_id} not found`);
    }
    return games[0];
  }

  update(_id: string, updateGameDto: UpdateGameDto) {
    return this.gameModel.findOneAndUpdate(
      { _id },
      { ...updateGameDto },
      { new: true },
    );
  }

  getGenres() {
    return this.gameModel.distinct('genre');
  }

  async remove(_id: string) {
    await this.gameModel.deleteOne({ _id });
  }

  addMedia(_id: string, addGameMediaDto: AddGameMediaDto) {
    const { media } = addGameMediaDto;
    return this.gameModel.findByIdAndUpdate(
      {
        _id,
      },
      {
        $addToSet: { media: media },
      },
      {
        new: true,
      },
    );
  }

  deleteMedia(_id: string, deleteGameMediaDto: DeleteGameMediaDto) {
    const { media } = deleteGameMediaDto;
    return this.gameModel.findByIdAndUpdate(
      {
        _id,
      },
      {
        $pull: { media: media },
      },
      {
        new: true,
      },
    );
  }

  addConsole(_id: string, addGameConsoleDto: AddGameConsoleDto) {
    const { console: gameConsole } = addGameConsoleDto;
    return this.gameModel.findByIdAndUpdate(
      {
        _id,
      },
      {
        $addToSet: { consoles: gameConsole },
      },
      {
        new: true,
      },
    );
  }

  deleteConsole(_id: string, deleteGameConsole: DeleteGameConsoleDto) {
    const { console } = deleteGameConsole;
    return this.gameModel.findByIdAndUpdate(
      {
        _id,
      },
      {
        $pull: { consoles: console },
      },
      {
        new: true,
      },
    );
  }

  getConsoles() {
    return this.gameModel.distinct('consoles');
  }

  async findAllFollowers(getFollowersDto: GetFollowersDto, id: string) {
    return await this.followService.findAll(getFollowersDto, id);
  }

  followGame(followee: string, user: User) {
    return this.followService.follow({
      followee,
      follower: user._id,
      onFolloweeModel: Game.name,
      onFollowerModel: User.name,
    });
  }

  unfollowGame(followee: string, user: User) {
    return this.followService.unfollow({
      follower: user._id,
      followee,
    });
  }

  async search(query: string) {
    const options: PaginateOptions = {
      page: 1,
      customLabels: {
        docs: 'games',
      },
    };
    const aggregate = this.gameModel.aggregate([
      {
        $match: { $text: { $search: query } },
      },
    ]);
    const games = await this.gameModel.aggregatePaginate(aggregate, options);
    return games;
  }
}
