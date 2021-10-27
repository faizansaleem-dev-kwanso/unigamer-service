import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  CacheInterceptor,
  CacheKey,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetGamesDto } from './dto/get-games.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { ReqUser } from '../../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { AddGameConsoleDto } from './dto/add-game-console.dto';
import { DeleteGameConsoleDto } from './dto/delete-game-console.dto';
import { DeleteGameMediaDto } from './dto/delete-game-media.dto';
import { AddGameMediaDto } from './dto/add-game-media.dto';
import { GetFollowersDto } from '../users/dto/get-followers.dto';

@ApiTags('Game')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.gamesService.search(query);
  }

  @Get('suggestions')
  suggestions(@ReqUser() user) {
    return this.gamesService.suggestions(user);
  }

  @Get()
  findAll(@Query() getGamesDto: GetGamesDto) {
    return this.gamesService.findAll(getGamesDto);
  }
  @Get('genres')
  getAllGeneres() {
    return this.gamesService.getGenres();
  }

  @Get('consoles')
  getAllConsoles() {
    return this.gamesService.getConsoles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }

  @Post(':id/media')
  addMedia(@Param('id') id: string, @Body() addGameMediaDto: AddGameMediaDto) {
    return this.gamesService.addMedia(id, addGameMediaDto);
  }

  @Delete(':id/media')
  deleteMedia(
    @Param('id') id: string,
    @Body() deleteGameMediaDto: DeleteGameMediaDto,
  ) {
    return this.gamesService.deleteMedia(id, deleteGameMediaDto);
  }

  @Post(':id/console')
  addConsole(
    @Param('id') id: string,
    @Body() addGameConsoleDto: AddGameConsoleDto,
  ) {
    return this.gamesService.addConsole(id, addGameConsoleDto);
  }

  @Delete(':id/console')
  deleteConsole(
    @Param('id') id: string,
    @Body() deleteGameConsoleDto: DeleteGameConsoleDto,
  ) {
    return this.gamesService.deleteConsole(id, deleteGameConsoleDto);
  }

  @Get(':id/followers')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('followers:game')
  getFollowers(
    @Param('id') id: string,
    @Query() getFollowersDto: GetFollowersDto,
  ) {
    return this.gamesService.findAllFollowers(getFollowersDto, id);
  }

  @Post('follow/:id')
  @UseGuards(AuthenticatedGuard)
  follow(@Param('id') id: string, @ReqUser() user: User) {
    return this.gamesService.followGame(id, user);
  }

  @Delete('unfollow/:id')
  @UseGuards(AuthenticatedGuard)
  unfollow(@Param('id') id: string, @ReqUser() user: User) {
    return this.gamesService.unfollowGame(id, user);
  }
}
