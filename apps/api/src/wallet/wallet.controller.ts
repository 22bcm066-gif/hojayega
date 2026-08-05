import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreatePayoutRequestDto } from './dto/create-payout-request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@ApiTags('wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.walletService.me(user.id);
  }

  @Post('payout-requests')
  requestPayout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePayoutRequestDto,
  ) {
    return this.walletService.requestPayout(user.id, dto);
  }

  @Get('payout-requests')
  payoutHistory(@CurrentUser() user: AuthenticatedUser) {
    return this.walletService.payoutHistory(user.id);
  }
}
