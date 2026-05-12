import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth-api'

export const dynamic = 'force-dynamic'

// authichain-api: the RapidAPI gateway worker (v2.4)
const CF_API = process.env.CF_API_URL || 'https://authichain-api.undone-k.workers.dev'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, Authorization, X-API-Key',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(req: NextRequest) {
  // 1. Validate API Key (AuthiChain Native)
  const auth = await validateApiKey(req)
  
  // If not a native key, check for RapidAPI key
  const rapidKey = req.headers.get('X-RapidAPI-Key')
  
  if (!auth.valid && !rapidKey) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: 401, headers: CORS }
    )
  }

  const serial = req.nextUrl.searchParams.get('id') || req.nextUrl.searchParams.get('productId') || req.nextUrl.searchParams.get('serial')
  if (!serial) {
    return NextResponse.json(
      { error: 'Missing required parameter: id or serial', usage: 'GET /api/v1/verify?id={serial}' },
      { status: 400, headers: CORS }
    )
  }
  return proxyVerify(serial, rapidKey || 'native_key', auth.userId)
}

export async function POST(req: NextRequest) {
  // 1. Validate API Key
  const auth = await validateApiKey(req)
  const rapidKey = req.headers.get('X-RapidAPI-Key')

  if (!auth.valid && !rapidKey) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: 401, headers: CORS }
    )
  }

  const body = await req.json().catch(() => ({}))
  const serial = body.serial || body.productId || body.id
  if (!serial) {
    return NextResponse.json(
      { error: 'Missing required field: serial or productId', usage: 'POST { "serial": "..." }' },
      { status: 400, headers: CORS }
    )
  }
  return proxyVerify(serial, rapidKey || 'native_key', auth.userId, body)
}

async function proxyVerify(serial: string, apiKey: string, userId?: string, extra: Record<string, unknown> = {}) {
  try {
    // If it's a native key, we use a internal bypass key for the CF worker
    const finalHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (apiKey === 'native_key') {
      finalHeaders['X-API-Key'] = 'ac_pro_key' // Use the internal pro key for worker access
    } else {
      finalHeaders['X-RapidAPI-Key'] = apiKey
    }

    const res = await fetch(`${CF_API}/api/v1/verify`, {
      method: 'POST',
      headers: finalHeaders,
      body: JSON.stringify({ 
        serial, 
        product: extra.product || serial, 
        caller_id: userId,
        ...extra 
      }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status, headers: CORS })
  } catch (err) {
    console.error('[v1/verify] Error:', err)
    return NextResponse.json(
      { error: 'Verification service temporarily unavailable' },
      { status: 503, headers: CORS }
    )
  }
}
