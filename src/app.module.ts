import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './mail/mail.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { RepliesModule } from './modules/replies/replies.module';
import { PostsModule } from './modules/posts/posts.module';
import { GamesModule } from './modules/games/games.module';
import { FollowModule } from './modules/follows/follows.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      load: [configuration],
      isGlobal: true,
    }),
    MailModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongouri'),
      }),
    }),
    CacheModule.register({
      store: redisStore,
      host: '34.244.214.255',
      port: 6379,
      password: 'l9kgBYUGNjXN',
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    CommentsModule,
    ReviewsModule,
    RepliesModule,
    PostsModule,
    FollowModule,
    GamesModule,
    MediaModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
