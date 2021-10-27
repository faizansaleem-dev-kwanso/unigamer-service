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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { ReqUser } from '../../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { GetReviewsDto } from './dto/get-reviews.dto';

@ApiTags('Review')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @ReqUser() user: User) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Get()
  // @UseGuards(AuthenticatedGuard)
  findAll(@Query() getReviewsDto: GetReviewsDto) {
    return this.reviewsService.findAll(getReviewsDto);
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Get(':id/overview')
  findReviewOverview(@Param('id') id: string) {
    return this.reviewsService.findReviewOverview(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @ReqUser() user: User,
  ) {
    return this.reviewsService.update(id, updateReviewDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  remove(@Param('id') id: string, @ReqUser() user: User) {
    return this.reviewsService.remove(id, user);
  }

  @Patch('/:id/like')
  @UseGuards(AuthenticatedGuard)
  like(@Param('id') id: string, @ReqUser() user: User) {
    return this.reviewsService.like(id, user);
  }

  @Patch('/:id/unlike')
  @UseGuards(AuthenticatedGuard)
  unlike(@Param('id') id: string, @ReqUser() user: User) {
    return this.reviewsService.unlike(id, user);
  }
}
