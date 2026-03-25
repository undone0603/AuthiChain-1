import { NextRequest, NextResponse } from 'next/server'
const E = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/authichain-verify`
const K = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export async function GET(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`${E}/${encodeURIComponent(id)}`, { headers: { apikey: K } })
  return NextResponse.json(await res.json(), { status: res.status })
}
