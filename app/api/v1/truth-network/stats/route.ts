import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const r = await fetch('https://qron-truth-network.undone-k.workers.dev/api/v1/truth-network/stats', {
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await r.json()
    return NextResponse.json(data, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'upstream unavailable' }, { status: 503 })
  }
}
