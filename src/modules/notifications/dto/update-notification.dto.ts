import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;

  @IsBoolean()
  @IsOptional()
  isRead: boolean;
}
