import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '50', 10)

  const { data: notifications } = await service
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('is_read', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit)

  const { count: unreadCount } = await service
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return NextResponse.json({ notifications: notifications ?? [], unreadCount: unreadCount ?? 0 })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const service = createServiceClient()

  // Mark single notification as read
  if (body.id) {
    await service
      .from('notifications')
      .update({ is_read: true })
      .eq('id', body.id)
      .eq('user_id', user.id)

    return NextResponse.json({ success: true })
  }

  // Mark all as read
  if (body.markAllRead) {
    await service
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'id or markAllRead required' }, { status: 400 })
}
