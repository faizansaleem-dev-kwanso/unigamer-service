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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { GetPostsDto } from './dto/get-posts.dto';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  create(@Body() createPostDto: CreatePostDto, @ReqUser() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  // @UseGuards(AuthenticatedGuard)
  findAll(@Query() getPostsDto: GetPostsDto) {
    return this.postsService.findAll(getPostsDto);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.postsService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @ReqUser() user: User,
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  remove(@Param('id') id: string, @ReqUser() user: User) {
    return this.postsService.remove(id, user);
  }

  @Patch('/:id/like')
  @UseGuards(AuthenticatedGuard)
  like(@Param('id') id: string, @ReqUser() user: User) {
    return this.postsService.like(id, user);
  }

  @Patch('/:id/unlike')
  @UseGuards(AuthenticatedGuard)
  unlike(@Param('id') id: string, @ReqUser() user: User) {
    return this.postsService.unlike(id, user);
  }
}
