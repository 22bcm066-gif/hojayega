import { Injectable } from '@nestjs/common';
import { generateOtp } from '../common/utils/codes.util';

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

/**
 * In-memory OTP store for the MVP. A real deployment swaps this for Redis
 * (shared across instances) and wires `send` to an SMS provider such as
 * MSG91 or Twilio Verify — see docs/07-api-reference.md.
 */
@Injectable()
export class OtpStoreService {
  private readonly store = new Map<string, OtpEntry>();
  private readonly ttlMs = 5 * 60 * 1000;
  private readonly maxAttempts = 5;

  issue(phone: string): string {
    const isDevStatic = process.env.NODE_ENV !== 'production';
    const code = isDevStatic
      ? process.env.OTP_STATIC_DEV_CODE || generateOtp()
      : generateOtp();
    this.store.set(phone, {
      code,
      expiresAt: Date.now() + this.ttlMs,
      attempts: 0,
    });
    // Dev-only: real deployments must never log OTPs, and must dispatch via an SMS provider instead.
    if (isDevStatic) {
      console.log(`[dev] OTP for ${phone}: ${code}`);
    }
    return code;
  }

  verify(phone: string, code: string): boolean {
    const entry = this.store.get(phone);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(phone);
      return false;
    }
    entry.attempts += 1;
    if (entry.attempts > this.maxAttempts) {
      this.store.delete(phone);
      return false;
    }
    const matches = entry.code === code;
    if (matches) this.store.delete(phone);
    return matches;
  }
}
