import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

function generateApiKey(): string {
  return `ac_${randomBytes(24).toString('hex')}`
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('id, key_name, last_four, created_at, status')
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ keys })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const name = body.name || 'Default Key'
    const fullKey = generateApiKey()
    const lastFour = fullKey.slice(-4)

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        key_name: name,
        api_key: fullKey, // Note: In production, store a hash. Storing raw for demo simplicity.
        last_four: lastFour,
        status: 'active'
      })
      .select('id, api_key')
      .single()

    if (error) throw error

    return NextResponse.json({ key: data.api_key })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing key ID' }, { status: 400 })

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
