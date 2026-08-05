import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { AddDisputeMessageDto } from './dto/add-dispute-message.dto';
import { NotificationsService } from '../notifications/notifications.service';

const DISPUTABLE_STATUSES = [
  'ACCEPTED',
  'HELPER_EN_ROUTE',
  'IN_PROGRESS',
  'AWAITING_CUSTOMER_APPROVAL',
  'COMPLETED',
];

@Injectable()
export class DisputesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(taskId: string, raisedById: string, dto: CreateDisputeDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { helper: true, dispute: true, escrow: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.dispute)
      throw new ConflictException('A dispute already exists for this task');
    if (!DISPUTABLE_STATUSES.includes(task.status)) {
      throw new BadRequestException(
        `Cannot dispute a task in status ${task.status}`,
      );
    }

    const isCustomer = task.customerId === raisedById;
    const isHelper = task.helper?.userId === raisedById;
    if (!isCustomer && !isHelper)
      throw new ForbiddenException('Not part of this task');

    const dispute = await this.prisma.$transaction(async (tx) => {
      const created = await tx.dispute.create({
        data: {
          taskId,
          raisedById,
          raisedByType: isCustomer ? 'CUSTOMER' : 'HELPER',
          reason: dto.reason,
          description: dto.description,
          evidencePhotos: dto.evidencePhotos ?? [],
        },
      });
      await tx.task.update({
        where: { id: taskId },
        data: { status: 'DISPUTED' },
      });
      if (task.escrow && task.escrow.status === 'HOLDING') {
        await tx.escrow.update({
          where: { id: task.escrow.id },
          data: { status: 'DISPUTED_HOLD' },
        });
      }
      return created;
    });

    const otherPartyId = isCustomer ? task.helper?.userId : task.customerId;
    if (otherPartyId) {
      await this.notifications.send(
        otherPartyId,
        'DISPUTE_UPDATE',
        'A dispute was raised',
        `A dispute was raised on "${task.title}". Our team is reviewing it.`,
        { taskId, disputeId: dispute.id },
      );
    }
    return dispute;
  }

  async addMessage(
    disputeId: string,
    senderId: string,
    isAdmin: boolean,
    dto: AddDisputeMessageDto,
  ) {
    const dispute = await this.requireAccess(disputeId, senderId, isAdmin);
    const senderType = isAdmin
      ? 'ADMIN'
      : dispute.task.customerId === senderId
        ? 'CUSTOMER'
        : 'HELPER';
    return this.prisma.disputeMessage.create({
      data: {
        disputeId: dispute.id,
        senderId,
        senderType,
        content: dto.content,
      },
    });
  }

  async getById(disputeId: string, userId: string, isAdmin: boolean) {
    const dispute = await this.requireAccess(disputeId, userId, isAdmin);
    return this.prisma.dispute.findUnique({
      where: { id: dispute.id },
      include: { task: true, messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  listForUser(userId: string) {
    return this.prisma.dispute.findMany({
      where: {
        OR: [
          { raisedById: userId },
          { task: { customerId: userId } },
          { task: { helper: { userId } } },
        ],
      },
      include: { task: { select: { title: true, code: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async requireAccess(
    disputeId: string,
    userId: string,
    isAdmin: boolean,
  ) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { task: { include: { helper: true } } },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');
    if (isAdmin) return dispute;
    const isParty =
      dispute.task.customerId === userId ||
      dispute.task.helper?.userId === userId;
    if (!isParty) throw new ForbiddenException('Not part of this dispute');
    return dispute;
  }
}
