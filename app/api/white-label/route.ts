import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

function isAdmin(req: NextRequest): boolean {
  const key = req.headers.get('x-admin-api-key') ?? req.headers.get('authorization')?.replace('Bearer ', '')
  return !!process.env.ADMIN_API_KEY && key === process.env.ADMIN_API_KEY
}

export async function GET(req: NextRequest) {
  const supabase = createServiceClient()
  const apiKey = req.nextUrl.searchParams.get('apiKey')

  // Public: validate API key
  if (apiKey) {
    const { data: client } = await supabase
      .from('white_label_clients')
      .select('company_name, domain, status')
      .eq('api_key', apiKey)
      .single()

    return NextResponse.json({
      valid: !!client && client.status === 'active',
      client: client ? { companyName: client.company_name, domain: client.domain } : null,
    })
  }

  // Admin: list all clients
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: clients } = await supabase
    .from('white_label_clients')
    .select('*')
    .order('created_at', { ascending: false })

  return NextResponse.json({ clients: clients ?? [] })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  if (!body.companyName || !body.userId) {
    return NextResponse.json({ error: 'companyName and userId required' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const apiKey = `wl_${randomBytes(24).toString('hex')}`
  const apiSecret = randomBytes(32).toString('hex')

  const { data: client, error } = await supabase
    .from('white_label_clients')
    .insert({
      user_id: body.userId,
      company_name: body.companyName,
      domain: body.domain,
      logo_url: body.logoUrl,
      primary_color: body.primaryColor,
      secondary_color: body.secondaryColor,
      api_key: apiKey,
      api_secret: apiSecret,
      api_call_limit: body.apiCallLimit ?? 10000,
      features: body.features,
    })
    .select('id, api_key')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: client.id, apiKey })
}
