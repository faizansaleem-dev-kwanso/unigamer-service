import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddGameConsoleDto {
  @ApiProperty({
    description: 'console name to add to the game',
  })
  @IsString()
  console: string;
}
