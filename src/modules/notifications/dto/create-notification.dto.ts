import { IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  type: string;

  @IsString()
  body: string;

  @IsString()
  sourceId: string;

  @IsString()
  sourceType: string;

  @IsString()
  recipient: string;

  @IsString()
  link: string;
}
