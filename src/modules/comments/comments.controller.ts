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
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../../common/decorators/user.decorator';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comment')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  create(@Body() createCommentDto: CreateCommentDto, @ReqUser() user: User) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Get()
  // @UseGuards(AuthenticatedGuard)
  findAll(@Query() getCommentsDto: GetCommentsDto) {
    return this.commentsService.findAll(getCommentsDto);
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @ReqUser() user: User,
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  remove(@Param('id') id: string, @ReqUser() user: User) {
    return this.commentsService.remove(id, user);
  }

  @Patch('/:id/like')
  @UseGuards(AuthenticatedGuard)
  like(@Param('id') id: string, @ReqUser() user: User) {
    return this.commentsService.like(id, user);
  }

  @Patch('/:id/unlike')
  @UseGuards(AuthenticatedGuard)
  unlike(@Param('id') id: string, @ReqUser() user: User) {
    return this.commentsService.unlike(id, user);
  }
}
