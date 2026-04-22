import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()

  // Get affiliate record
  const { data: affiliate } = await service
    .from('affiliates')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!affiliate) {
    return NextResponse.json({ error: 'Not enrolled in affiliate program' }, { status: 404 })
  }

  // Get commissions as referral history
  const { data: commissions } = await service
    .from('affiliate_commissions')
    .select('*')
    .eq('affiliateid', affiliate.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ referrals: commissions ?? [] })
}
