import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
