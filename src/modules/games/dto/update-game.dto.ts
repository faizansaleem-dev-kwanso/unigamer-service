import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';

export class UpdateGameDto extends OmitType(PartialType(CreateGameDto), [
  'adBanner',
  'isSponsored',
] as const) {}
