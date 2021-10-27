import { IsMongoId } from 'class-validator';

export class FollowUserDto {
  @IsMongoId()
  followee: string;
}
