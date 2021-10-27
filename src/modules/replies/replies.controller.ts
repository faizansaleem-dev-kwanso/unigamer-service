import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { GetRepliesDto } from './dto/get-replies.dto';

@ApiTags('Reply')
@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  create(@Body() createReplyDto: CreateReplyDto, @ReqUser() user: User) {
    return this.repliesService.create(createReplyDto, user);
  }

  @Get()
  // @UseGuards(AuthenticatedGuard)
  findAll(@Query() getRepliesDto: GetRepliesDto) {
    return this.repliesService.findAll(getRepliesDto);
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  findOne(@Param('id') id: string) {
    return this.repliesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  update(
    @Param('id') id: string,
    @Body() updateReplyDto: UpdateReplyDto,
    @ReqUser() user: User,
  ) {
    return this.repliesService.update(id, updateReplyDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  remove(@Param('id') id: string, @ReqUser() user: User) {
    return this.repliesService.remove(id, user);
  }

  @Patch('/:id/like')
  @UseGuards(AuthenticatedGuard)
  like(@Param('id') id: string, @ReqUser() user: User) {
    return this.repliesService.like(id, user);
  }

  @Patch('/:id/unlike')
  @UseGuards(AuthenticatedGuard)
  unlike(@Param('id') id: string, @ReqUser() user: User) {
    return this.repliesService.unlike(id, user);
  }
}
