import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { RejectKycDto } from './dto/reject-kyc.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { SetCommissionDto } from './dto/set-commission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers(@Query('q') q?: string) {
    return this.adminService.listUsers(q);
  }

  @Patch('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.adminService.updateUserStatus(id, dto);
  }

  @Get('kyc/pending')
  pendingKyc() {
    return this.adminService.pendingKyc();
  }

  @Post('kyc/:helperId/approve')
  approveKyc(@Param('helperId') helperId: string) {
    return this.adminService.approveKyc(helperId);
  }

  @Post('kyc/:helperId/reject')
  rejectKyc(@Param('helperId') helperId: string, @Body() dto: RejectKycDto) {
    return this.adminService.rejectKyc(helperId, dto);
  }

  @Get('disputes')
  listDisputes(@Query('status') status?: string) {
    return this.adminService.listDisputes(status);
  }

  @Post('disputes/:id/resolve')
  resolveDispute(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ResolveDisputeDto,
  ) {
    return this.adminService.resolveDispute(id, user.id, dto);
  }

  @Get('commission-settings')
  listCommissionSettings() {
    return this.adminService.listCommissionSettings();
  }

  @Post('commission-settings')
  setCommission(@Body() dto: SetCommissionDto) {
    return this.adminService.setCommission(dto);
  }

  @Get('tasks')
  listTasks(@Query('status') status?: string) {
    return this.adminService.listTasks(status);
  }

  @Post('tasks/:id/force-cancel')
  forceCancelTask(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.forceCancelTask(id, reason);
  }

  @Get('analytics/overview')
  overview() {
    return this.adminService.overview();
  }
}
