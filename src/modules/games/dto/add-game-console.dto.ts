import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Game } from '../entities/game.entity';

export class AddGameConsoleDto {
  @ApiProperty({
    description: 'console name to add to the game',
  })
  @IsString()
  console: string;
}

export class GameWithStats extends Game {
  @IsOptional()
  @IsString()
  followers: number;
  @IsOptional()
  @IsString()
  followee: number;
  @IsOptional()
  @IsString()
  posts: number;
}
