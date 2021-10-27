import { IsMongoId } from 'class-validator';

export class UnfollowDto {
  @IsMongoId()
  followee: string;

  @IsMongoId()
  follower: string;
}
