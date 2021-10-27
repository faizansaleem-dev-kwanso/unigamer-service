import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class DeleteGameMediaDto {
  @ApiProperty({
    description: 'media name to delete  from the game',
  })
  @IsUrl()
  media: string;
}
