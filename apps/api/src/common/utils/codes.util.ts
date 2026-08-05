const ALPHANUM = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid confusion

function randomCode(length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  }
  return out;
}

export function generateReferralCode(): string {
  return `HSTLE-${randomCode(6)}`;
}

/** Human-friendly task code, e.g. HSTLE-AHM-4F82K1. Not guaranteed unique — caller should retry on collision. */
export function generateTaskCode(cityAbbr = 'AHM'): string {
  return `HSTLE-${cityAbbr}-${randomCode(6)}`;
}

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function generateInvoiceNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `HSTLE/INV/${year}/${String(sequence).padStart(6, '0')}`;
}
