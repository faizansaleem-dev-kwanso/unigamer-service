import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class AddGameMediaDto {
  @ApiProperty({
    description: 'media url name to add to the game',
  })
  @IsUrl()
  media: string;
}
