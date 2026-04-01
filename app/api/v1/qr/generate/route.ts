import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60  // Vercel Pro: up to 60s for long-running generation

const QRON_WORKER = process.env.QRON_WORKER_URL || 'https://qron-ai-api.undone-k.workers.dev'
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { url, style = 'space', prompt } = body as { url?: string; style?: string; prompt?: string }

    if (!url) {
      return NextResponse.json({ error: 'url is required' }, { status: 400, headers: CORS })
    }

    // Call qron-ai-api directly (bypasses authichain-api hop) for max timeout headroom
    const res = await fetch(`${QRON_WORKER}/v1/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, style, prompt }),
      signal: AbortSignal.timeout(55000),  // 55s — leaves 5s for response
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status, headers: CORS })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Generation timeout'
    return NextResponse.json(
      { error: 'QR generation failed', message: msg, hint: 'HuggingFace Space may be cold-starting, retry in 30s' },
      { status: 503, headers: CORS }
    )
  }
}
