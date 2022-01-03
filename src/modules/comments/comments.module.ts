import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import MongoPaging from 'mongoose-paginate-v2';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './entities/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Comment.name,
        useFactory: () => {
          const schema = CommentSchema;
          schema.plugin(MongoPaging);
          return schema;
        },
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
