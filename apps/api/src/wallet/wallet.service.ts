import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePayoutRequestDto } from './dto/create-payout-request.dto';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const wallet = await this.prisma.wallet.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 50 } },
    });
    return wallet;
  }

  async requestPayout(userId: string, dto: CreatePayoutRequestDto) {
    const helper = await this.prisma.helperProfile.findUnique({
      where: { userId },
      include: { bankAccount: true },
    });
    if (!helper) throw new BadRequestException('Onboard as a helper first');
    if (!helper.bankAccount)
      throw new BadRequestException(
        'Add a bank account before requesting a payout',
      );

    const wallet = await this.prisma.wallet.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
    if (Number(wallet.balance) < dto.amount)
      throw new BadRequestException('Insufficient wallet balance');

    return this.prisma.$transaction(async (tx) => {
      const newBalance = Number(wallet.balance) - dto.amount;
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: newBalance },
      });
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAWAL',
          amount: -dto.amount,
          balanceAfter: newBalance,
          referenceType: 'PAYOUT',
          description: `Payout requested to ${helper.bankAccount!.bankName} ••${helper.bankAccount!.accountNumberMasked.slice(-4)}`,
        },
      });
      return tx.payoutRequest.create({
        data: {
          helperId: helper.id,
          amount: dto.amount,
          bankAccountId: helper.bankAccount!.id,
        },
      });
    });
  }

  payoutHistory(userId: string) {
    return this.prisma.helperProfile
      .findUnique({ where: { userId } })
      .then(async (helper) => {
        if (!helper) throw new NotFoundException('Helper profile not found');
        return this.prisma.payoutRequest.findMany({
          where: { helperId: helper.id },
          orderBy: { requestedAt: 'desc' },
        });
      });
  }
}
