import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

function isAdmin(req: NextRequest): boolean {
  const key = req.headers.get('x-admin-api-key') ?? req.headers.get('authorization')?.replace('Bearer ', '')
  return !!process.env.ADMIN_API_KEY && key === process.env.ADMIN_API_KEY
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const { data: bonuses } = await service
    .from('bonuses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ bonuses: bonuses ?? [] })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  if (!body.userId || !body.bonusType || !body.bonusName || !body.bonusValue) {
    return NextResponse.json({ error: 'userId, bonusType, bonusName, bonusValue required' }, { status: 400 })
  }

  const service = createServiceClient()
  const { data: bonus, error } = await service
    .from('bonuses')
    .insert({
      user_id: body.userId,
      bonus_type: body.bonusType,
      bonus_name: body.bonusName,
      bonus_value: body.bonusValue,
      tier: body.tier,
      delivery_method: body.deliveryMethod || 'account_credit',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: bonus.id })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bonusId } = await req.json()
  if (!bonusId) {
    return NextResponse.json({ error: 'bonusId required' }, { status: 400 })
  }

  const service = createServiceClient()

  // Verify bonus belongs to user and is claimable
  const { data: bonus } = await service
    .from('bonuses')
    .select('id, status')
    .eq('id', bonusId)
    .eq('user_id', user.id)
    .single()

  if (!bonus) {
    return NextResponse.json({ error: 'Bonus not found' }, { status: 404 })
  }

  if (bonus.status !== 'pending') {
    return NextResponse.json({ error: 'Bonus already claimed or delivered' }, { status: 400 })
  }

  await service
    .from('bonuses')
    .update({ status: 'claimed', claimed_at: new Date().toISOString() })
    .eq('id', bonusId)

  return NextResponse.json({ success: true })
}
