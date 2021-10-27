import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePreSignedUrlDto {
  @ApiProperty({
    description: 'filename of the file',
  })
  @IsString()
  name: string;
}
