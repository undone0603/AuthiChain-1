import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const service = createServiceClient()

  const { data: mission } = await service
    .from('missions')
    .select('*')
    .eq('id', id)
    .single()

  if (!mission) {
    return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
  }

  const { data: tasks } = await service
    .from('mission_tasks')
    .select('*')
    .eq('mission_id', id)
    .order('task_order', { ascending: true })

  return NextResponse.json({ ...mission, tasks: tasks ?? [] })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const validStatuses = ['pending', 'active', 'completed', 'failed']
  if (!body.status || !validStatuses.includes(body.status)) {
    return NextResponse.json({ error: 'Valid status required' }, { status: 400 })
  }

  const service = createServiceClient()
  await service
    .from('missions')
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ success: true })
}
