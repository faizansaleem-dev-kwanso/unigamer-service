import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import MongoAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './entities/game.entity';
import { FollowModule } from '../follows/follows.module';
import { ConfigService } from 'aws-sdk';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Game.name,
        useFactory: () => {
          const schema = GameSchema;
          schema.plugin(MongoAggregatePaginate);
          return schema;
        },
      },
    ]),
    CacheModule.register({
      store: redisStore,
      host: '34.244.214.255',
      port: 6379,
      password: 'l9kgBYUGNjXN',
      max: 1000,
      ttl: 3600,
    }),
    FollowModule,
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
