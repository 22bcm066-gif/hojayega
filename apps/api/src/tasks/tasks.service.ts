import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '../../generated/prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { SubmitProofDto } from './dto/submit-proof.dto';
import { CancelTaskDto } from './dto/cancel-task.dto';
import { generateOtp, generateTaskCode } from '../common/utils/codes.util';
import { distanceKm } from '../common/utils/geo.util';
import { NotificationsService } from '../notifications/notifications.service';

const DEFAULT_COMMISSION_PERCENT = 15;

const TASK_DETAIL_INCLUDE = {
  category: true,
  customer: { select: { id: true, name: true, avatarUrl: true, phone: true } },
  helper: {
    include: {
      user: { select: { id: true, name: true, avatarUrl: true, phone: true } },
    },
  },
  pickupAddress: true,
  dropAddress: true,
  siteAddress: true,
  statusEvents: { orderBy: { createdAt: 'asc' as const } },
  escrow: true,
  chat: true,
  dispute: true,
  reviews: true,
} as const;

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(customerId: string, dto: CreateTaskDto) {
    const category = await this.prisma.taskCategory.findUnique({
      where: { slug: dto.categorySlug },
    });
    if (!category || !category.active)
      throw new BadRequestException('Unknown or inactive task category');

    for (const [field, id] of [
      ['pickupAddressId', dto.pickupAddressId],
      ['dropAddressId', dto.dropAddressId],
      ['siteAddressId', dto.siteAddressId],
    ] as const) {
      if (id) {
        const addr = await this.prisma.address.findFirst({
          where: { id, userId: customerId },
        });
        if (!addr) throw new BadRequestException(`Invalid ${field}`);
      }
    }
    if (!dto.pickupAddressId && !dto.siteAddressId) {
      throw new BadRequestException(
        'At least a site or pickup address is required',
      );
    }

    const commissionPercent = await this.getCommissionPercent(category.id);
    const priceOffered = dto.priceOffered;
    const platformFee = round2((priceOffered * commissionPercent) / 100);
    const helperPayout = round2(priceOffered - platformFee);
    const code = generateTaskCode();
    const completionOtp = generateOtp();

    const task = await this.prisma.$transaction(async (tx) => {
      const created = await tx.task.create({
        data: {
          code,
          customerId,
          categoryId: category.id,
          title: dto.title,
          description: dto.description,
          photos: dto.photos ?? [],
          priceOffered,
          pickupAddressId: dto.pickupAddressId,
          dropAddressId: dto.dropAddressId,
          siteAddressId: dto.siteAddressId,
          scheduledFor: dto.scheduledFor
            ? new Date(dto.scheduledFor)
            : undefined,
          isUrgent: dto.isUrgent ?? false,
          completionOtp,
          status: 'POSTED',
        },
      });

      // MVP payment capture is stubbed — a production build creates a Razorpay
      // order, verifies the checkout signature client-side, and only marks
      // the payment CAPTURED after the webhook confirms it (docs/07-api-reference.md).
      const payment = await tx.payment.create({
        data: {
          userId: customerId,
          taskId: created.id,
          provider: 'RAZORPAY',
          providerPaymentId: `mock_pay_${created.id}`,
          method: 'upi',
          amount: priceOffered,
          status: 'CAPTURED',
        },
      });

      await tx.escrow.create({
        data: {
          taskId: created.id,
          amount: priceOffered,
          platformFee,
          helperPayout,
          status: 'HOLDING',
          paymentId: payment.id,
        },
      });

      await tx.taskStatusEvent.create({
        data: {
          taskId: created.id,
          status: 'POSTED',
          actorType: 'CUSTOMER',
          actorId: customerId,
        },
      });

      return created;
    });

    return this.getById(task.id, customerId);
  }

  async feed(params: {
    lat?: number;
    lng?: number;
    categorySlug?: string;
    radiusKm?: number;
  }) {
    const tasks = await this.prisma.task.findMany({
      where: {
        status: 'POSTED',
        ...(params.categorySlug
          ? { category: { slug: params.categorySlug } }
          : {}),
      },
      include: {
        category: true,
        pickupAddress: true,
        siteAddress: true,
        customer: { select: { name: true, avatarUrl: true } },
      },
      orderBy: [{ isUrgent: 'desc' }, { createdAt: 'desc' }],
      take: 100,
    });

    if (params.lat === undefined || params.lng === undefined) {
      return tasks.map((t) => ({ ...t, distanceKm: null }));
    }

    const radius = params.radiusKm ?? 10;
    return tasks
      .map((t) => {
        const addr = t.siteAddress ?? t.pickupAddress;
        const dKm = addr
          ? distanceKm(params.lat!, params.lng!, addr.lat, addr.lng)
          : null;
        return { ...t, distanceKm: dKm };
      })
      .filter((t) => t.distanceKm === null || t.distanceKm <= radius)
      .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  }

  myTasks(customerId: string, status?: string) {
    return this.prisma.task.findMany({
      where: {
        customerId,
        ...(status ? { status: status as TaskStatus } : {}),
      },
      include: {
        category: true,
        helper: {
          include: { user: { select: { name: true, avatarUrl: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignedTasks(helperUserId: string, status?: string) {
    const helper = await this.requireHelperProfile(helperUserId);
    return this.prisma.task.findMany({
      where: {
        helperId: helper.id,
        ...(status ? { status: status as TaskStatus } : {}),
      },
      include: {
        category: true,
        customer: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(taskId: string, requesterId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: TASK_DETAIL_INCLUDE,
    });
    if (!task) throw new NotFoundException('Task not found');

    const isCustomer = task.customerId === requesterId;
    const isAssignedHelper = task.helper?.userId === requesterId;
    if (!isCustomer && !isAssignedHelper) {
      // Hide the completion OTP and phone numbers from anyone but the two parties.
      return { ...task, completionOtp: undefined };
    }
    // Only the customer should ever see the completion OTP.
    return isCustomer ? task : { ...task, completionOtp: undefined };
  }

  async accept(taskId: string, helperUserId: string) {
    const helper = await this.requireHelperProfile(helperUserId);
    if (helper.kycStatus !== 'APPROVED') {
      throw new ForbiddenException(
        'KYC must be approved before accepting tasks',
      );
    }

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { escrow: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.status !== 'POSTED')
      throw new BadRequestException('Task is no longer available');

    await this.prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: taskId },
        data: {
          helperId: helper.id,
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      });
      await tx.taskStatusEvent.create({
        data: {
          taskId,
          status: 'ACCEPTED',
          actorType: 'HELPER',
          actorId: helperUserId,
        },
      });
      await tx.chat.create({ data: { taskId } });

      if (task.escrow) {
        const wallet = await tx.wallet.upsert({
          where: { userId: helperUserId },
          create: { userId: helperUserId },
          update: {},
        });
        const newPending =
          Number(wallet.pendingBalance) + Number(task.escrow.helperPayout);
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { pendingBalance: newPending },
        });
        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'ESCROW_HOLD',
            amount: task.escrow.helperPayout,
            balanceAfter: wallet.balance,
            referenceType: 'TASK',
            referenceId: taskId,
            description: `Escrow held for task ${task.code}`,
          },
        });
      }
    });

    await this.notifications.send(
      task.customerId,
      'TASK_ACCEPTED',
      'Helper on the way',
      `A verified helper accepted "${task.title}".`,
      { taskId },
    );
    return this.getById(taskId, task.customerId);
  }

  async updateStatus(
    taskId: string,
    helperUserId: string,
    dto: UpdateTaskStatusDto,
  ) {
    const task = await this.getOwnedByHelper(taskId, helperUserId);
    const allowed: Record<string, string[]> = {
      ACCEPTED: ['HELPER_EN_ROUTE', 'IN_PROGRESS'],
      HELPER_EN_ROUTE: ['IN_PROGRESS'],
    };
    if (!allowed[task.status]?.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot move task from ${task.status} to ${dto.status}`,
      );
    }

    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: dto.status,
        ...(dto.status === 'IN_PROGRESS' ? { startedAt: new Date() } : {}),
      },
    });
    await this.prisma.taskStatusEvent.create({
      data: {
        taskId,
        status: dto.status,
        actorType: 'HELPER',
        actorId: helperUserId,
        note: dto.note,
      },
    });

    if (dto.status === 'HELPER_EN_ROUTE') {
      await this.notifications.send(
        task.customerId,
        'HELPER_EN_ROUTE',
        'Helper is on the way',
        `Your helper for "${task.title}" is en route.`,
        { taskId },
      );
    }
    return this.getById(taskId, task.customerId);
  }

  async submitProof(taskId: string, helperUserId: string, dto: SubmitProofDto) {
    const task = await this.getOwnedByHelper(taskId, helperUserId);
    if (task.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Task must be in progress to submit proof');
    }
    if (task.completionOtp !== dto.otp) {
      throw new BadRequestException('Invalid completion OTP');
    }

    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'AWAITING_CUSTOMER_APPROVAL',
        proofPhotos: dto.photos,
        proofNotes: dto.notes,
        otpVerifiedAt: new Date(),
      },
    });
    await this.prisma.taskStatusEvent.create({
      data: {
        taskId,
        status: 'AWAITING_CUSTOMER_APPROVAL',
        actorType: 'HELPER',
        actorId: helperUserId,
      },
    });

    await this.notifications.send(
      task.customerId,
      'TASK_COMPLETED',
      'Task marked complete',
      `Review the proof for "${task.title}" and approve payment release.`,
      { taskId },
    );
    return this.getById(taskId, task.customerId);
  }

  async approve(taskId: string, customerId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { escrow: true, helper: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.customerId !== customerId)
      throw new ForbiddenException('Not your task');
    if (task.status !== 'AWAITING_CUSTOMER_APPROVAL')
      throw new BadRequestException('Task is not awaiting approval');
    if (!task.escrow || !task.helper)
      throw new BadRequestException('Task is missing escrow or helper data');

    await this.prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: taskId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          priceFinal: task.priceOffered,
        },
      });
      await tx.taskStatusEvent.create({
        data: {
          taskId,
          status: 'COMPLETED',
          actorType: 'CUSTOMER',
          actorId: customerId,
        },
      });
      await tx.escrow.update({
        where: { id: task.escrow!.id },
        data: { status: 'RELEASED', releasedAt: new Date() },
      });

      const wallet = await tx.wallet.upsert({
        where: { userId: task.helper!.userId },
        create: { userId: task.helper!.userId },
        update: {},
      });
      const payout = Number(task.escrow!.helperPayout);
      const newPending = Math.max(0, Number(wallet.pendingBalance) - payout);
      const newBalance = Number(wallet.balance) + payout;
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { pendingBalance: newPending, balance: newBalance },
      });
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'ESCROW_RELEASE',
          amount: payout,
          balanceAfter: newBalance,
          referenceType: 'TASK',
          referenceId: taskId,
          description: `Payout released for task ${task.code}`,
        },
      });
      await tx.helperProfile.update({
        where: { id: task.helper!.id },
        data: {
          totalEarnings: { increment: payout },
          totalJobsCompleted: { increment: 1 },
        },
      });
    });

    await this.notifications.send(
      task.helper.userId,
      'PAYMENT_RELEASED',
      'Payment released',
      `Payment for "${task.title}" has been released to your wallet.`,
      { taskId },
    );
    return this.getById(taskId, customerId);
  }

  async cancel(taskId: string, requesterId: string, dto: CancelTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { escrow: true, helper: true },
    });
    if (!task) throw new NotFoundException('Task not found');

    const isCustomer = task.customerId === requesterId;
    const isHelper = task.helper?.userId === requesterId;
    if (!isCustomer && !isHelper)
      throw new ForbiddenException('Not part of this task');
    if (
      ['COMPLETED', 'CANCELLED', 'REFUNDED', 'DISPUTED'].includes(task.status)
    ) {
      throw new BadRequestException(
        `Task in status ${task.status} cannot be cancelled`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: taskId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: dto.reason,
          cancelledByType: isCustomer ? 'CUSTOMER' : 'HELPER',
        },
      });
      await tx.taskStatusEvent.create({
        data: {
          taskId,
          status: 'CANCELLED',
          actorType: isCustomer ? 'CUSTOMER' : 'HELPER',
          actorId: requesterId,
          note: dto.reason,
        },
      });

      if (task.escrow && task.escrow.status === 'HOLDING') {
        await tx.escrow.update({
          where: { id: task.escrow.id },
          data: { status: 'REFUNDED', refundedAt: new Date() },
        });
        if (task.escrow.paymentId) {
          await tx.payment.update({
            where: { id: task.escrow.paymentId },
            data: { status: 'REFUNDED' },
          });
        }
      }

      if (task.helper) {
        const wallet = await tx.wallet.findUnique({
          where: { userId: task.helper.userId },
        });
        if (wallet && task.escrow) {
          const newPending = Math.max(
            0,
            Number(wallet.pendingBalance) - Number(task.escrow.helperPayout),
          );
          await tx.wallet.update({
            where: { id: wallet.id },
            data: { pendingBalance: newPending },
          });
        }
        if (isHelper) {
          await tx.helperProfile.update({
            where: { id: task.helper.id },
            data: { totalJobsCancelled: { increment: 1 } },
          });
        }
      }
    });

    return this.getById(taskId, task.customerId);
  }

  private async getOwnedByHelper(taskId: string, helperUserId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { helper: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.helper?.userId !== helperUserId)
      throw new ForbiddenException('Not your assigned task');
    return task;
  }

  private async requireHelperProfile(userId: string) {
    const helper = await this.prisma.helperProfile.findUnique({
      where: { userId },
    });
    if (!helper) throw new BadRequestException('Onboard as a helper first');
    return helper;
  }

  private async getCommissionPercent(categoryId: string): Promise<number> {
    const specific = await this.prisma.commissionSetting.findFirst({
      where: { categoryId },
      orderBy: { effectiveFrom: 'desc' },
    });
    if (specific) return Number(specific.commissionPercent);

    const global = await this.prisma.commissionSetting.findFirst({
      where: { categoryId: null },
      orderBy: { effectiveFrom: 'desc' },
    });
    return global
      ? Number(global.commissionPercent)
      : DEFAULT_COMMISSION_PERCENT;
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
