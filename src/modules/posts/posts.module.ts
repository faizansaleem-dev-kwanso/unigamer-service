import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import MongoPaging from 'mongoose-paginate-v2';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: () => {
          const schema = PostSchema;
          schema.plugin(MongoPaging);
          return schema;
        },
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
