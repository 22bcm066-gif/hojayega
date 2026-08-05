import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(taskId: string, reviewerId: string, dto: CreateReviewDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { helper: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.status !== 'COMPLETED')
      throw new BadRequestException('Task must be completed before reviewing');

    const isCustomer = task.customerId === reviewerId;
    const isHelper = task.helper?.userId === reviewerId;
    if (!isCustomer && !isHelper)
      throw new ForbiddenException('Not part of this task');

    const direction = isCustomer ? 'CUSTOMER_TO_HELPER' : 'HELPER_TO_CUSTOMER';
    const revieweeId = isCustomer ? task.helper!.userId : task.customerId;

    const existing = await this.prisma.review.findUnique({
      where: { taskId_direction: { taskId, direction } },
    });
    if (existing)
      throw new ConflictException('Review already submitted for this task');

    const review = await this.prisma.review.create({
      data: {
        taskId,
        reviewerId,
        revieweeId,
        direction,
        rating: dto.rating,
        comment: dto.comment,
        tags: dto.tags ?? [],
      },
    });

    if (direction === 'CUSTOMER_TO_HELPER') {
      const agg = await this.prisma.review.aggregate({
        where: { revieweeId, direction: 'CUSTOMER_TO_HELPER' },
        _avg: { rating: true },
      });
      await this.prisma.helperProfile.update({
        where: { userId: revieweeId },
        data: { rating: agg._avg.rating ?? dto.rating },
      });
    }

    return review;
  }

  forUser(userId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      orderBy: { createdAt: 'desc' },
      include: { reviewer: { select: { name: true, avatarUrl: true } } },
    });
  }
}
