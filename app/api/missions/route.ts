import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const status = req.nextUrl.searchParams.get('status')

  let query = service.from('missions').select('*').order('created_at', { ascending: false })
  if (status) {
    query = query.eq('status', status)
  }

  const { data: missions } = await query
  return NextResponse.json({ missions: missions ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.title || !body.description) {
    return NextResponse.json({ error: 'title and description required' }, { status: 400 })
  }

  const service = createServiceClient()
  const { data: mission, error } = await service
    .from('missions')
    .insert({
      title: body.title,
      description: body.description,
      type: body.type || null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: mission.id })
}
