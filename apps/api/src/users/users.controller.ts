import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpsertAddressDto } from './dto/upsert-address.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get('me/addresses')
  listAddresses(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.listAddresses(user.id);
  }

  @Post('me/addresses')
  addAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertAddressDto,
  ) {
    return this.usersService.addAddress(user.id, dto);
  }

  @Patch('me/addresses/:id')
  updateAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpsertAddressDto,
  ) {
    return this.usersService.updateAddress(user.id, id, dto);
  }

  @Delete('me/addresses/:id')
  deleteAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.usersService.deleteAddress(user.id, id);
  }

  @Get('me/notifications')
  notifications(
    @CurrentUser() user: AuthenticatedUser,
    @Query('unread') unread?: string,
  ) {
    return this.usersService.notifications(user.id, unread === 'true');
  }

  @Patch('me/notifications/:id/read')
  markRead(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.usersService.markNotificationRead(user.id, id);
  }

  @Post('me/devices')
  registerDevice(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { token: string; platform: 'IOS' | 'ANDROID' | 'WEB' },
  ) {
    return this.usersService.registerDeviceToken(
      user.id,
      body.token,
      body.platform,
    );
  }
}
