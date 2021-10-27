import { IsEnum, IsMongoId } from 'class-validator';
import { Game } from '../../../modules/games/entities/game.entity';
import { User } from '../../../modules/users/entities/user.entity';

export class FollowDto {
  @IsMongoId()
  follower: string;

  @IsEnum([User.name, Game.name])
  onFollowerModel: string;

  @IsMongoId()
  followee: string;

  @IsEnum([User.name, Game.name])
  onFolloweeModel: string;
}
