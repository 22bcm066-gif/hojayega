import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  list(activeOnly = true) {
    return this.prisma.taskCategory.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { sortOrder: 'asc' },
    });
  }
}
