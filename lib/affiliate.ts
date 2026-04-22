/**
 * Affiliate System — ported from authichain-unified/server/referral/core.ts
 */
import { randomBytes } from 'crypto'

export const AFFILIATE_BONUS_TIERS = [
  { threshold: 5, bonus: 1000, tier: 'silver' as const },
  { threshold: 10, bonus: 2500, tier: 'gold' as const },
  { threshold: 25, bonus: 7500, tier: 'platinum' as const },
]

export const COMMISSION_RATES: Record<string, number> = {
  starter: 0.10,
  professional: 0.15,
  enterprise: 0.20,
  agency: 0.25,
}

export function generateAffiliateCode(userId: string): string {
  return `af_${userId.slice(0, 8)}_${randomBytes(4).toString('hex')}`
}

export function calculateCommission(amount: number, rate = 0.10): number {
  return Math.round(amount * rate * 100) / 100
}
