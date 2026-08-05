import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  phone: string;
}

export interface AuthenticatedUser {
  id: string;
  phone: string;
  name: string | null;
  isHelper: boolean;
  isAdmin: boolean;
  status: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { adminProfile: true },
    });
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid or inactive account');
    }
    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      isHelper: user.isHelper,
      isAdmin: !!user.adminProfile,
      status: user.status,
    };
  }
}
