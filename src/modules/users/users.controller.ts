import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ReqUser } from '../../common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { GetUsersDto } from './dto/get-users.dto';
import { GetFollowersDto } from './dto/get-followers.dto';
import { UpdateUsersSocialDto } from './dto/update-users-social.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';
import { query } from 'express';

@ApiTags('User')
@ApiCookieAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get('search')
  search(@Query('q') query: string) {
    return this.usersService.search(query);
  }

  @Get('followers')
  @UseGuards(AuthenticatedGuard)
  findAllFollowers(
    @Query() getFollowersDto: GetFollowersDto,
    @ReqUser() user: User,
  ) {
    // return 'Hello';
    return this.usersService.findAllFollowers(getFollowersDto, user);
  }

  @Get()
  findAll(@Query() getUsersDto: GetUsersDto) {
    return this.usersService.findAll(getUsersDto);
  }

  @Get('meta/:id')
  findUserMeta(@Param('id') id: string) {
    return this.usersService.findUserMeta(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @Delete(':id')
  // @UseGuards(AuthenticatedGuard)
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Patch('profile')
  @UseGuards(AuthenticatedGuard)
  update(@Body() updateUserDto: UpdateUserProfileDto, @ReqUser() user: User) {
    return this.usersService.update(updateUserDto, user);
  }

  @Patch('console/:name')
  @UseGuards(AuthenticatedGuard)
  updateConsole(@Param('name') console: string, @ReqUser() user: User) {
    return this.usersService.updateConsole(console, user);
  }
  @Delete('console/:name')
  @UseGuards(AuthenticatedGuard)
  deleteConsole(@Param('name') name: string, @ReqUser() user: User) {
    return this.usersService.deleteConsole(name, user);
  }

  @Patch('social')
  @UseGuards(AuthenticatedGuard)
  updateSocial(
    @Body() updateUserSocialDto: UpdateUsersSocialDto,
    @ReqUser() user: User,
  ) {
    return this.usersService.updateSocial(updateUserSocialDto, user);
  }

  @Patch('change-password')
  @UseGuards(AuthenticatedGuard)
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @ReqUser() user: User,
  ) {
    return this.usersService.changePassword(changePasswordDto, user);
  }

  // @Get('/friends')
  // @UseGuards(AuthenticatedGuard)
  // getMyFriends(@ReqUser() user){
  //   return this.usersService.getMyFriends(user);
  // }

  @Delete('social/:name')
  @UseGuards(AuthenticatedGuard)
  deleteSocial(@Param('name') name: string, @ReqUser() user: User) {
    return this.usersService.deleteSocial(name, user);
  }

  @Post('follow/:id')
  @UseGuards(AuthenticatedGuard)
  followUser(@Param('id') id: string, @ReqUser() user: User) {
    return this.usersService.followUser(id, user);
  }

  @Delete('unfollow/:id')
  @UseGuards(AuthenticatedGuard)
  unFollowUser(@Param('id') id: string, @ReqUser() user: User) {
    return this.usersService.unFollowUser(id, user);
  }
}
