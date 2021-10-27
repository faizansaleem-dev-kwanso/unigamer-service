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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { ReqUser } from '../../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { GetNotificationsDto } from './dto/get-notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @ReqUser() user: User,
  ) {
    return this.notificationsService.create(createNotificationDto, user);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  findAll(
    @Query() getNotificationsDto: GetNotificationsDto,
    @ReqUser() user: User,
  ) {
    return this.notificationsService.findAll(getNotificationsDto, user);
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  findOne(@Param('id') id: string, @ReqUser() user: User) {
    return this.notificationsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @ReqUser() user: User,
  ) {
    return this.notificationsService.update(id, updateNotificationDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
