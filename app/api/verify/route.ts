import { NextRequest, NextResponse } from 'next/server'
import { buildVerifyPayload, mapVerificationResponse } from '@/lib/verification'
import { getVerifyApiMissingMessage, getVerifyApiUrl } from '@/lib/verification-config'

export async function POST(request: NextRequest) {
  let rawInput = ''
  try {
    const body = await request.json().catch(() => ({}))
    rawInput = String(body?.raw ?? body?.input ?? '').trim()

    if (!rawInput) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }

    const verifyApiUrl = getVerifyApiUrl()
    if (!verifyApiUrl) {
      const mapped = mapVerificationResponse({}, rawInput)
      return NextResponse.json(
        {
          ...mapped,
          success: false,
          message: getVerifyApiMissingMessage(),
        },
        { status: 200 }
      )
    }

    const payload = buildVerifyPayload(rawInput)
    const upstream = await fetch(verifyApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const data = await upstream.json().catch(() => null)
    if (data === null) {
      const mapped = mapVerificationResponse({}, rawInput)
      return NextResponse.json(
        {
          upstreamStatus: upstream.status,
          ...mapped,
          success: false,
          message: 'Upstream returned non-JSON response',
        },
        { status: 200 }
      )
    }

    if (!upstream.ok) {
      const mapped = mapVerificationResponse(data, rawInput)
      return NextResponse.json(
        {
          upstreamStatus: upstream.status,
          ...mapped,
          success: false,
          message: data?.message || 'Verification request failed',
        },
        { status: 200 }
      )
    }

    return NextResponse.json(mapVerificationResponse(data, rawInput))
  } catch (error) {
    console.error('Verify proxy error:', error)
    const mapped = mapVerificationResponse({}, rawInput)
    return NextResponse.json(
      {
        ...mapped,
        success: false,
        message: 'Failed to verify product',
      },
      { status: 200 }
    )
  }
}
