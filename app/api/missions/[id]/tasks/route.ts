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

  const { data: tasks } = await service
    .from('mission_tasks')
    .select('*')
    .eq('mission_id', id)
    .order('task_order', { ascending: true })

  return NextResponse.json({ tasks: tasks ?? [] })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const retryTaskId = req.nextUrl.searchParams.get('retry')

  const service = createServiceClient()

  // Retry a failed task
  if (retryTaskId) {
    await service
      .from('mission_tasks')
      .update({ status: 'pending', updated_at: new Date().toISOString() })
      .eq('id', retryTaskId)
      .eq('mission_id', id)

    return NextResponse.json({ success: true })
  }

  // Create new task
  const body = await req.json()
  if (!body.title || !body.description) {
    return NextResponse.json({ error: 'title and description required' }, { status: 400 })
  }

  const { data: maxOrder } = await service
    .from('mission_tasks')
    .select('task_order')
    .eq('mission_id', id)
    .order('task_order', { ascending: false })
    .limit(1)
    .single()

  const { data: task, error } = await service
    .from('mission_tasks')
    .insert({
      mission_id: id,
      title: body.title,
      description: body.description,
      status: 'pending',
      task_order: (maxOrder?.task_order ?? 0) + 1,
      payload: body.payload,
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: task.id })
}
