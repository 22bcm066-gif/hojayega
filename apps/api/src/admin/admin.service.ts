import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DisputeStatus,
  Prisma,
  TaskStatus,
} from '../../generated/prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

type TransactionClient = Prisma.TransactionClient;
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { RejectKycDto } from './dto/reject-kyc.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { SetCommissionDto } from './dto/set-commission.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // ── Users ────────────────────────────────────────────────────────────
  listUsers(query?: string) {
    return this.prisma.user.findMany({
      where: query
        ? {
            OR: [
              { phone: { contains: query } },
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { helperProfile: { select: { kycStatus: true, rating: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async updateUserStatus(userId: string, dto: UpdateUserStatusDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { status: dto.status },
    });
    await this.notifications.send(
      userId,
      'SYSTEM',
      'Account status updated',
      `Your account status is now ${dto.status}.`,
    );
    return user;
  }

  // ── KYC ──────────────────────────────────────────────────────────────
  pendingKyc() {
    return this.prisma.helperProfile.findMany({
      where: { kycStatus: 'IN_REVIEW' },
      include: {
        user: { select: { name: true, phone: true, avatarUrl: true } },
        kycDocuments: true,
      },
      orderBy: { kycSubmittedAt: 'asc' },
    });
  }

  async approveKyc(helperId: string) {
    const helper = await this.prisma.helperProfile.findUnique({
      where: { id: helperId },
    });
    if (!helper) throw new NotFoundException('Helper not found');
    const updated = await this.prisma.helperProfile.update({
      where: { id: helperId },
      data: {
        kycStatus: 'APPROVED',
        kycApprovedAt: new Date(),
        faceVerifiedAt: new Date(),
      },
    });
    await this.prisma.kycDocument.updateMany({
      where: { helperId, status: 'PENDING' },
      data: { status: 'APPROVED', reviewedAt: new Date() },
    });
    await this.notifications.send(
      helper.userId,
      'KYC_UPDATE',
      'KYC approved',
      'You are verified! You can now accept tasks on HSTLE.',
    );
    return updated;
  }

  async rejectKyc(helperId: string, dto: RejectKycDto) {
    const helper = await this.prisma.helperProfile.findUnique({
      where: { id: helperId },
    });
    if (!helper) throw new NotFoundException('Helper not found');
    const updated = await this.prisma.helperProfile.update({
      where: { id: helperId },
      data: { kycStatus: 'REJECTED' },
    });
    await this.prisma.kycDocument.updateMany({
      where: { helperId, status: 'PENDING' },
      data: {
        status: 'REJECTED',
        rejectionReason: dto.reason,
        reviewedAt: new Date(),
      },
    });
    await this.notifications.send(
      helper.userId,
      'KYC_UPDATE',
      'KYC needs attention',
      `Your verification was rejected: ${dto.reason}`,
    );
    return updated;
  }

  // ── Disputes ─────────────────────────────────────────────────────────
  listDisputes(status?: string) {
    return this.prisma.dispute.findMany({
      where: status ? { status: status as DisputeStatus } : undefined,
      include: {
        task: { select: { title: true, code: true, priceOffered: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveDispute(
    disputeId: string,
    adminUserId: string,
    dto: ResolveDisputeDto,
  ) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { task: { include: { escrow: true, helper: true } } },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    if (!['OPEN', 'UNDER_REVIEW'].includes(dispute.status))
      throw new BadRequestException('Dispute already resolved');

    const { task } = dispute;
    const escrow = task.escrow;

    await this.prisma.$transaction(async (tx) => {
      await tx.dispute.update({
        where: { id: disputeId },
        data: {
          status: dto.status,
          resolutionNote: dto.resolutionNote,
          resolvedById: adminUserId,
          resolvedAt: new Date(),
          refundAmount: dto.refundAmount,
        },
      });

      if (dto.status === 'RESOLVED_CUSTOMER') {
        if (escrow) {
          await tx.escrow.update({
            where: { id: escrow.id },
            data: { status: 'REFUNDED', refundedAt: new Date() },
          });
          if (escrow.paymentId)
            await tx.payment.update({
              where: { id: escrow.paymentId },
              data: { status: 'REFUNDED' },
            });
          if (task.helper)
            await this.reversePendingBalance(
              tx,
              task.helper.userId,
              Number(escrow.helperPayout),
            );
        }
        await tx.task.update({
          where: { id: task.id },
          data: { status: 'REFUNDED' },
        });
      } else if (dto.status === 'RESOLVED_HELPER') {
        if (escrow && task.helper) {
          await tx.escrow.update({
            where: { id: escrow.id },
            data: { status: 'RELEASED', releasedAt: new Date() },
          });
          await this.payoutHelper(
            tx,
            task.helper.id,
            task.helper.userId,
            task.code,
            Number(escrow.helperPayout),
          );
        }
        await tx.task.update({
          where: { id: task.id },
          data: { status: 'COMPLETED', completedAt: new Date() },
        });
      } else if (dto.status === 'RESOLVED_SPLIT') {
        const refund = dto.refundAmount ?? 0;
        if (escrow) {
          const helperShare = Math.max(0, Number(escrow.helperPayout) - refund);
          await tx.escrow.update({
            where: { id: escrow.id },
            data: { status: 'PARTIALLY_REFUNDED', releasedAt: new Date() },
          });
          if (task.helper) {
            await this.reversePendingBalance(
              tx,
              task.helper.userId,
              Number(escrow.helperPayout),
            );
            if (helperShare > 0)
              await this.payoutHelper(
                tx,
                task.helper.id,
                task.helper.userId,
                task.code,
                helperShare,
                false,
              );
          }
        }
        await tx.task.update({
          where: { id: task.id },
          data: { status: 'REFUNDED' },
        });
      }
      // CLOSED — dispute dismissed, no monetary movement.
    });

    if (task.customerId) {
      await this.notifications.send(
        task.customerId,
        'DISPUTE_UPDATE',
        'Dispute resolved',
        `Your dispute on "${task.title}" has been resolved: ${dto.resolutionNote}`,
      );
    }
    if (task.helper) {
      await this.notifications.send(
        task.helper.userId,
        'DISPUTE_UPDATE',
        'Dispute resolved',
        `The dispute on "${task.title}" has been resolved: ${dto.resolutionNote}`,
      );
    }

    return this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { task: true },
    });
  }

  private async reversePendingBalance(
    tx: TransactionClient,
    helperUserId: string,
    amount: number,
  ) {
    const wallet = await tx.wallet.findUnique({
      where: { userId: helperUserId },
    });
    if (!wallet) return;
    const newPending = Math.max(0, Number(wallet.pendingBalance) - amount);
    await tx.wallet.update({
      where: { id: wallet.id },
      data: { pendingBalance: newPending },
    });
  }

  private async payoutHelper(
    tx: TransactionClient,
    helperId: string,
    helperUserId: string,
    taskCode: string,
    amount: number,
    countAsCompletedJob = true,
  ) {
    const wallet = await tx.wallet.upsert({
      where: { userId: helperUserId },
      create: { userId: helperUserId },
      update: {},
    });
    const newPending = Math.max(0, Number(wallet.pendingBalance) - amount);
    const newBalance = Number(wallet.balance) + amount;
    await tx.wallet.update({
      where: { id: wallet.id },
      data: { pendingBalance: newPending, balance: newBalance },
    });
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'ESCROW_RELEASE',
        amount,
        balanceAfter: newBalance,
        referenceType: 'TASK',
        referenceId: taskCode,
        description: `Dispute resolution payout for task ${taskCode}`,
      },
    });
    if (countAsCompletedJob) {
      await tx.helperProfile.update({
        where: { id: helperId },
        data: {
          totalEarnings: { increment: amount },
          totalJobsCompleted: { increment: 1 },
        },
      });
    } else {
      await tx.helperProfile.update({
        where: { id: helperId },
        data: { totalEarnings: { increment: amount } },
      });
    }
  }

  // ── Commission settings ─────────────────────────────────────────────
  listCommissionSettings() {
    return this.prisma.commissionSetting.findMany({
      orderBy: { effectiveFrom: 'desc' },
    });
  }

  setCommission(dto: SetCommissionDto) {
    return this.prisma.commissionSetting.create({
      data: {
        categoryId: dto.categoryId,
        commissionPercent: dto.commissionPercent,
      },
    });
  }

  // ── Task moderation ──────────────────────────────────────────────────
  listTasks(status?: string) {
    return this.prisma.task.findMany({
      where: status ? { status: status as TaskStatus } : undefined,
      include: {
        category: true,
        customer: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async forceCancelTask(taskId: string, reason: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { escrow: true, helper: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    if (['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(task.status)) {
      throw new BadRequestException(
        `Task already in terminal status ${task.status}`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: taskId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: reason,
          cancelledByType: 'ADMIN',
        },
      });
      await tx.taskStatusEvent.create({
        data: { taskId, status: 'CANCELLED', actorType: 'ADMIN', note: reason },
      });
      if (task.escrow && task.escrow.status === 'HOLDING') {
        await tx.escrow.update({
          where: { id: task.escrow.id },
          data: { status: 'REFUNDED', refundedAt: new Date() },
        });
        if (task.escrow.paymentId)
          await tx.payment.update({
            where: { id: task.escrow.paymentId },
            data: { status: 'REFUNDED' },
          });
        if (task.helper)
          await this.reversePendingBalance(
            tx,
            task.helper.userId,
            Number(task.escrow.helperPayout),
          );
      }
    });
    return this.prisma.task.findUnique({ where: { id: taskId } });
  }

  // ── Analytics ────────────────────────────────────────────────────────
  async overview() {
    const [
      totalUsers,
      totalHelpers,
      approvedHelpers,
      tasksByStatus,
      gmv,
      disputesOpen,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.helperProfile.count(),
      this.prisma.helperProfile.count({ where: { kycStatus: 'APPROVED' } }),
      this.prisma.task.groupBy({ by: ['status'], _count: true }),
      this.prisma.escrow.aggregate({
        _sum: { amount: true, platformFee: true },
        where: { status: { in: ['RELEASED', 'PARTIALLY_REFUNDED'] } },
      }),
      this.prisma.dispute.count({
        where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } },
      }),
    ]);

    return {
      totalUsers,
      totalHelpers,
      approvedHelpers,
      tasksByStatus: Object.fromEntries(
        tasksByStatus.map((t) => [t.status, t._count]),
      ),
      grossMerchandiseValue: gmv._sum.amount ?? 0,
      totalCommissionEarned: gmv._sum.platformFee ?? 0,
      openDisputes: disputesOpen,
    };
  }
}
