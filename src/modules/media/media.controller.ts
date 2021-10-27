import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../../common/decorators/user.decorator';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { User } from '../users/entities/user.entity';
import { CreatePreSignedUrlDto } from './dto/create-pre-signed-url.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  getSignedUrl(
    @Body() createPreSignedUrlDto: CreatePreSignedUrlDto,
    @ReqUser() user: User,
  ) {
    return this.mediaService.getSignedUrl(createPreSignedUrlDto, user);
  }
}
