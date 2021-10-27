import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetCommentsDto {
  @ApiProperty({
    description: 'filter for comments data',
  })
  @IsOptional()
  @IsString()
  filter: string;
}
