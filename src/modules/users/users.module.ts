import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';
import { UserCreatedListener } from './listeners/user-created.listener';
import { MailModule } from '../../mail/mail.module';
import MongoAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowModule } from '../follows/follows.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(MongoAggregatePaginate);
          return schema;
        },
      },
    ]),
    MailModule,
    FollowModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserCreatedListener],
  exports: [UsersService],
})
export class UsersModule {}
