import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnboardHelperDto } from './dto/onboard-helper.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { SubmitKycDocumentDto } from './dto/submit-kyc-document.dto';
import { UpsertBankAccountDto } from './dto/upsert-bank-account.dto';

@Injectable()
export class HelpersService {
  constructor(private readonly prisma: PrismaService) {}

  async onboard(userId: string, dto: OnboardHelperDto) {
    const existing = await this.prisma.helperProfile.findUnique({
      where: { userId },
    });
    if (existing) throw new ConflictException('Helper profile already exists');

    const categories = await this.prisma.taskCategory.findMany({
      where: { slug: { in: dto.categorySlugs } },
    });
    if (categories.length === 0)
      throw new BadRequestException('No valid categories provided');

    const profile = await this.prisma.helperProfile.create({
      data: {
        userId,
        bio: dto.bio,
        skills: dto.skills,
        languages: dto.languages,
        kycStatus: 'PENDING',
        categories: { create: categories.map((c) => ({ categoryId: c.id })) },
      },
      include: { categories: { include: { category: true } } },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { isHelper: true },
    });
    return profile;
  }

  async me(userId: string) {
    const profile = await this.prisma.helperProfile.findUnique({
      where: { userId },
      include: {
        categories: { include: { category: true } },
        kycDocuments: true,
        bankAccount: true,
      },
    });
    if (!profile)
      throw new NotFoundException('Helper profile not found — onboard first');
    return profile;
  }

  async updateAvailability(userId: string, dto: UpdateAvailabilityDto) {
    const profile = await this.requireProfile(userId);
    return this.prisma.helperProfile.update({
      where: { id: profile.id },
      data: {
        availability: dto.availability,
        ...(dto.lat !== undefined ? { currentLat: dto.lat } : {}),
        ...(dto.lng !== undefined ? { currentLng: dto.lng } : {}),
      },
    });
  }

  async submitKycDocument(userId: string, dto: SubmitKycDocumentDto) {
    const profile = await this.requireProfile(userId);
    const doc = await this.prisma.kycDocument.create({
      data: { helperId: profile.id, type: dto.type, fileUrl: dto.fileUrl },
    });
    if (
      profile.kycStatus === 'NOT_STARTED' ||
      profile.kycStatus === 'PENDING'
    ) {
      await this.prisma.helperProfile.update({
        where: { id: profile.id },
        data: {
          kycStatus: 'IN_REVIEW',
          kycSubmittedAt: profile.kycSubmittedAt ?? new Date(),
        },
      });
    }
    return doc;
  }

  async upsertBankAccount(userId: string, dto: UpsertBankAccountDto) {
    const profile = await this.requireProfile(userId);
    const masked = `XXXX${dto.accountNumber.slice(-4)}`;
    return this.prisma.bankAccount.upsert({
      where: { helperId: profile.id },
      create: {
        helperId: profile.id,
        accountHolderName: dto.accountHolderName,
        accountNumberMasked: masked,
        ifsc: dto.ifsc,
        bankName: dto.bankName,
      },
      update: {
        accountHolderName: dto.accountHolderName,
        accountNumberMasked: masked,
        ifsc: dto.ifsc,
        bankName: dto.bankName,
        verified: false,
        verifiedAt: null,
      },
    });
  }

  async earnings(userId: string) {
    const profile = await this.requireProfile(userId);
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 30 } },
    });
    return {
      totalEarnings: profile.totalEarnings,
      totalJobsCompleted: profile.totalJobsCompleted,
      rating: profile.rating,
      wallet,
    };
  }

  async leaderboard(city = 'Ahmedabad', take = 20) {
    return this.prisma.helperProfile.findMany({
      where: { user: { city }, kycStatus: 'APPROVED' },
      orderBy: [{ totalJobsCompleted: 'desc' }, { rating: 'desc' }],
      take,
      include: {
        user: { select: { name: true, avatarUrl: true, city: true } },
      },
    });
  }

  private async requireProfile(userId: string) {
    const profile = await this.prisma.helperProfile.findUnique({
      where: { userId },
    });
    if (!profile)
      throw new NotFoundException('Helper profile not found — onboard first');
    return profile;
  }
}
