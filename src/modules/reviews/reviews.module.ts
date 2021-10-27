import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import MongoPaging from 'mongoose-paginate-v2';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './entities/review.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Review.name,
        useFactory: () => {
          const schema = ReviewSchema;
          schema.plugin(MongoPaging);
          return schema;
        },
      },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
