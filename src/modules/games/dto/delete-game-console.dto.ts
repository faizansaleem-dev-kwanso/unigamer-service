import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteGameConsoleDto {
  @ApiProperty({
    description: 'console name to delete  from the game',
  })
  @IsString()
  console: string;
}
