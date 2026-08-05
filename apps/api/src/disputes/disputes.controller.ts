import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { AddDisputeMessageDto } from './dto/add-dispute-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@ApiTags('disputes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post('tasks/:taskId/disputes')
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('taskId') taskId: string,
    @Body() dto: CreateDisputeDto,
  ) {
    return this.disputesService.create(taskId, user.id, dto);
  }

  @Get('disputes/me')
  mine(@CurrentUser() user: AuthenticatedUser) {
    return this.disputesService.listForUser(user.id);
  }

  @Get('disputes/:id')
  getById(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.disputesService.getById(id, user.id, user.isAdmin);
  }

  @Post('disputes/:id/messages')
  addMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: AddDisputeMessageDto,
  ) {
    return this.disputesService.addMessage(id, user.id, user.isAdmin, dto);
  }
}
