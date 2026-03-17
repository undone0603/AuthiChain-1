import { NextRequest, NextResponse } from 'next/server'
import { buildVerifyPayload, mapVerificationResponse } from '@/lib/verification'
import { getVerifyApiMissingMessage, getVerifyApiUrl } from '@/lib/verification-config'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rawInput = params.id

  try {
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
    const data = await upstream.json().catch(() => ({}))

    if (!upstream.ok) {
      const mapped = mapVerificationResponse(data, rawInput)
      return NextResponse.json(
        {
          ...mapped,
          success: false,
          message: data?.message || 'Verification request failed',
        },
        { status: 200 }
      )
    }

    return NextResponse.json(mapVerificationResponse(data, rawInput), { status: 200 })
  } catch (error) {
    console.error('Verification error:', error)
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
