import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HelpersService } from './helpers.service';
import { OnboardHelperDto } from './dto/onboard-helper.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { SubmitKycDocumentDto } from './dto/submit-kyc-document.dto';
import { UpsertBankAccountDto } from './dto/upsert-bank-account.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@ApiTags('helpers')
@Controller('helpers')
export class HelpersController {
  constructor(private readonly helpersService: HelpersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('onboard')
  onboard(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: OnboardHelperDto,
  ) {
    return this.helpersService.onboard(user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HELPER')
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.helpersService.me(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HELPER')
  @Patch('me/availability')
  updateAvailability(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.helpersService.updateAvailability(user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HELPER')
  @Post('me/kyc-documents')
  submitKyc(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubmitKycDocumentDto,
  ) {
    return this.helpersService.submitKycDocument(user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HELPER')
  @Post('me/bank-account')
  upsertBankAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertBankAccountDto,
  ) {
    return this.helpersService.upsertBankAccount(user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HELPER')
  @Get('me/earnings')
  earnings(@CurrentUser() user: AuthenticatedUser) {
    return this.helpersService.earnings(user.id);
  }

  @Get('leaderboard')
  leaderboard(@Query('city') city?: string) {
    return this.helpersService.leaderboard(city);
  }
}
