import { Controller, Patch, Request, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch('settings/notifications')
  async updateNotifications(@Request() req, @Body('enabled') enabled: boolean) {
    return this.usersService.updateNotificationSettings(req.user.userId, enabled);
  }
}