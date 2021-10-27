import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUsersDto {
  @ApiProperty({
    description: 'Page number for the users',
  })
  @IsString()
  page: number;

  @IsString()
  @IsOptional()
  sortBy: string;

  @IsOptional()
  limit: number;
}
