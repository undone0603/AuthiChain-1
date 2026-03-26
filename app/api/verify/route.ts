import { NextRequest, NextResponse } from 'next/server'
const CF = process.env.CF_WORKER_URL || 'https://authichain-unified.undone-k.workers.dev'
export async function POST(r: NextRequest) {
  const b = await r.json().catch(() => ({}))
  const res = await fetch(`${CF}/api/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) })
  return NextResponse.json(await res.json(), { status: res.status })
}
export async function GET() { return NextResponse.json({ status: 'ok', backend: 'authichain-unified' }) }
