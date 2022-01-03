import { Module } from '@nestjs/common';
import { FollowService } from './follows.service';
import { FollowController } from './follows.controller';
import MongoPaging from 'mongoose-paginate-v2';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './entities/follow.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Follow.name,
        useFactory: () => {
          const schema = FollowSchema;
          schema.plugin(MongoPaging);
          return schema;
        },
      },
    ]),
  ],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
