import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions, Types } from 'mongoose';
import { Game } from '../games/entities/game.entity';
import { User } from '../users/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsDto } from './dto/get-reviews.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: PaginateModel<Review>,
  ) { }

  async create(createReviewDto: CreateReviewDto, user: User) {
    const review = new this.reviewModel({
      ...createReviewDto,
      owner: user._id,
    });
    const reviewResponse = await review.save();
    return this.reviewModel.populate(reviewResponse, [
      { path: 'owner', model: User.name },
      { path: 'game', model: Game.name },
    ]);
  }

  findAll(getReviewsDto: GetReviewsDto) {
    const { page, limit, game } = getReviewsDto;
    const options: PaginateOptions = {
      page: page,
      limit: limit,
      populate: ['owner', 'game', 'likedBy'],
      customLabels: {
        docs: 'reviews',
      },
    };
    return this.reviewModel.paginate({ game }, options);
  }

  async findReviewOverview(_id: string) {
    const overview = {};
    const fields = ['rating', 'experience', 'difficulty', 'hoursPlayed'];
    for (let index = 0; index < fields.length; index++) {
      const response = await this.reviewModel.aggregate([
        {
          $match: {
            game: Types.ObjectId(_id),
          },
        },
        {
          $group: {
            _id: {
              $toLower: `$${fields[index]}`,
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $group: {
            _id: null,
            counts: {
              $push: {
                k: '$_id',
                v: '$count',
              },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $arrayToObject: '$counts',
            },
          },
        },
      ]);
      overview[fields[index]] = response[0];
    }
    return overview;
  }

  findOne(_id: string) {
    return this.reviewModel
      .findOne({ _id })
      .populate(['owner', 'game', 'likedBy']);
  }

  update(_id: string, updateReviewDto: UpdateReviewDto, user: User) {
    return this.reviewModel.findOneAndUpdate(
      {
        _id,
        owner: user._id,
      },
      {
        ...updateReviewDto,
      },
      { new: true },
    );
  }

  async remove(_id: string, user: User) {
    await this.reviewModel.deleteOne({ _id, owner: user._id });
  }

  like(_id: string, user: User) {
    return this.reviewModel.updateOne(
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
    return this.reviewModel.updateOne(
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
