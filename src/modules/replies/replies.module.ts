import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesController } from './replies.controller';
import MongoPaging from 'mongoose-paginate-v2';
import { MongooseModule } from '@nestjs/mongoose';
import { Reply, ReplySchema } from './entities/reply.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Reply.name,
        useFactory: () => {
          const schema = ReplySchema;
          schema.plugin(MongoPaging);
          return schema;
        },
      },
    ]),
  ],
  controllers: [RepliesController],
  providers: [RepliesService],
  exports: [RepliesService],
})
export class RepliesModule {}
