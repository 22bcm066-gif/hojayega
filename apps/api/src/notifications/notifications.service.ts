import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

type NotificationType =
  | 'TASK_POSTED'
  | 'TASK_ACCEPTED'
  | 'HELPER_EN_ROUTE'
  | 'HELPER_ARRIVED'
  | 'TASK_COMPLETED'
  | 'PAYMENT_RELEASED'
  | 'DISPUTE_UPDATE'
  | 'KYC_UPDATE'
  | 'PROMO'
  | 'REFERRAL'
  | 'SYSTEM';

/**
 * Persists an in-app notification and (in a real deployment) fans it out via
 * Firebase Cloud Messaging to the user's registered device tokens. Push
 * dispatch is stubbed here — see docs/07-api-reference.md.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async send(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: data as Prisma.InputJsonValue | undefined,
      },
    });

    const devices = await this.prisma.deviceToken.findMany({
      where: { userId },
    });
    if (devices.length > 0) {
      this.logger.debug(
        `[fcm-stub] would push "${title}" to ${devices.length} device(s) for user ${userId}`,
      );
    }
    return notification;
  }
}
