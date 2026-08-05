import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { OtpStoreService } from './otp-store.service';
import { generateReferralCode } from '../common/utils/codes.util';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly otp: OtpStoreService,
  ) {}

  requestOtp(phone: string) {
    this.otp.issue(phone);
    return {
      message: 'OTP sent',
      devHint:
        process.env.NODE_ENV !== 'production'
          ? 'Use OTP_STATIC_DEV_CODE from .env'
          : undefined,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const ok = this.otp.verify(dto.phone, dto.otp);
    if (!ok) throw new BadRequestException('Invalid or expired OTP');

    let user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      let referredById: string | undefined;
      if (dto.referralCode) {
        const referrer = await this.prisma.user.findUnique({
          where: { referralCode: dto.referralCode },
        });
        referredById = referrer?.id;
      }

      user = await this.prisma.user.create({
        data: {
          phone: dto.phone,
          phoneVerifiedAt: new Date(),
          name: dto.name,
          referralCode: generateReferralCode(),
          referredById,
          wallet: { create: {} },
        },
      });

      if (referredById) {
        await this.prisma.referral.create({
          data: {
            referrerId: referredById,
            refereeId: user.id,
            code: dto.referralCode!,
          },
        });
      }
    } else if (!user.phoneVerifiedAt) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { phoneVerifiedAt: new Date() },
      });
    }

    const tokens = this.issueTokens(user.id, user.phone);
    return { ...tokens, isNewUser, user };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; phone: string };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || user.status !== 'ACTIVE')
      throw new UnauthorizedException('Account not active');
    return this.issueTokens(user.id, user.phone);
  }

  private issueTokens(sub: string, phone: string) {
    const accessToken = this.jwt.sign(
      { sub, phone },
      {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_TTL'),
      },
    );
    const refreshToken = this.jwt.sign(
      { sub, phone },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_TTL'),
      },
    );
    return { accessToken, refreshToken };
  }
}
