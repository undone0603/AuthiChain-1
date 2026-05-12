import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/auth-api'

export const dynamic = 'force-dynamic'

const CF_API = process.env.CF_API_URL || 'https://authichain-api.undone-k.workers.dev'
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, Authorization, X-API-Key',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

async function proxy(req: NextRequest, method: string) {
  // 1. Validate API Key
  const auth = await validateApiKey(req)
  const rapidKey = req.headers.get('X-RapidAPI-Key')

  if (!auth.valid && !rapidKey) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: 401, headers: CORS }
    )
  }

  try {
    const url = new URL(req.url)
    const target = `${CF_API}${url.pathname}${url.search}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (rapidKey) {
      headers['X-RapidAPI-Key'] = rapidKey
    } else {
      headers['X-API-Key'] = 'ac_pro_key' // Internal bypass
    }

    const init: RequestInit = { 
      method, 
      headers, 
      signal: AbortSignal.timeout(15000) 
    }
    
    if (method === 'POST') {
      init.body = await req.text()
    }

    const res = await fetch(target, init)
    const data = await res.json()
    
    return NextResponse.json({
      ...data,
      caller_id: auth.userId
    }, { status: res.status, headers: CORS })

  } catch (err) {
    console.error('[v1/classify] Error:', err)
    return NextResponse.json(
      { error: 'Classification service temporarily unavailable' },
      { status: 503, headers: CORS }
    )
  }
}

export const GET  = (req: NextRequest) => proxy(req, 'GET')
export const POST = (req: NextRequest) => proxy(req, 'POST')
