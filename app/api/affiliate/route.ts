import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateAffiliateCode, AFFILIATE_BONUS_TIERS } from '@/lib/affiliate'

export const dynamic = 'force-dynamic'

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()

  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!affiliate) {
    return NextResponse.json({ enrolled: false })
  }

  const { data: commissions } = await supabase
    .from('affiliate_commissions')
    .select('*')
    .eq('affiliate_id', affiliate.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const totalEarned = parseFloat(affiliate.total_earnings ?? '0')
  const pendingPayout = parseFloat(affiliate.pending_payout ?? '0')
  const nextTier = AFFILIATE_BONUS_TIERS.find(t => (affiliate.total_referrals ?? 0) < t.threshold)

  return NextResponse.json({
    enrolled: true,
    affiliate,
    commissions: commissions ?? [],
    totalEarned,
    pendingPayout,
    nextTierThreshold: nextTier?.threshold ?? null,
    nextTierBonus: nextTier?.bonus ?? null,
  })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createServiceClient()

  // Check if already enrolled
  const { data: existing } = await supabase
    .from('affiliates')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Already enrolled in affiliate program' }, { status: 409 })
  }

  const code = generateAffiliateCode(user.id)

  const { data: affiliate, error } = await supabase
    .from('affiliates')
    .insert({
      user_id: user.id,
      affiliate_code: code,
      status: 'active',
      commission_rate: 10.00,
      payout_method: body.payoutMethod || 'paypal',
      payout_details: body.paypalEmail ? { paypalEmail: body.paypalEmail } : null,
    })
    .select('id, affiliate_code')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, affiliateCode: code, id: affiliate.id })
}
