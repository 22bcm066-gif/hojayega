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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { SubmitProofDto } from './dto/submit-proof.dto';
import { CancelTaskDto } from './dto/cancel-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Roles('CUSTOMER')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.id, dto);
  }

  @Roles('HELPER')
  @Get('feed')
  feed(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('categorySlug') categorySlug?: string,
    @Query('radiusKm') radiusKm?: string,
  ) {
    return this.tasksService.feed({
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      categorySlug,
      radiusKm: radiusKm ? Number(radiusKm) : undefined,
    });
  }

  @Roles('CUSTOMER')
  @Get('mine')
  mine(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
  ) {
    return this.tasksService.myTasks(user.id, status);
  }

  @Roles('HELPER')
  @Get('assigned')
  assigned(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
  ) {
    return this.tasksService.assignedTasks(user.id, status);
  }

  @Roles('CUSTOMER', 'HELPER')
  @Get(':id')
  getById(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tasksService.getById(id, user.id);
  }

  @Roles('HELPER')
  @Post(':id/accept')
  accept(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tasksService.accept(id, user.id);
  }

  @Roles('HELPER')
  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(id, user.id, dto);
  }

  @Roles('HELPER')
  @Post(':id/proof')
  submitProof(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: SubmitProofDto,
  ) {
    return this.tasksService.submitProof(id, user.id, dto);
  }

  @Roles('CUSTOMER')
  @Post(':id/approve')
  approve(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tasksService.approve(id, user.id);
  }

  @Roles('CUSTOMER', 'HELPER')
  @Post(':id/cancel')
  cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CancelTaskDto,
  ) {
    return this.tasksService.cancel(id, user.id, dto);
  }
}
