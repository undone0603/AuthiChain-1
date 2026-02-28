export type VerifyPayload = {
  productIdentifier?: string
  tokenId?: number
  qrCode?: string
}

export function isLikelyUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

export function normalizeProductIdentifier(value: string): string {
  return value.trim().toUpperCase()
}

export function buildVerifyPayload(rawInput: string): VerifyPayload {
  const raw = rawInput.trim()

  if (isLikelyUrl(raw)) {
    return { qrCode: raw }
  }

  if (/PROD-/i.test(raw) || /^[A-Z]{2,}-[A-Z0-9-]+$/i.test(raw)) {
    return { productIdentifier: normalizeProductIdentifier(raw) }
  }

  if (/^\d+$/.test(raw)) {
    return { tokenId: Number(raw) }
  }

  return { qrCode: raw }
}

export type VerificationViewModel = {
  result: 'authentic' | 'counterfeit'
  authentic: boolean
  trust_score: number
  confidence: 'High' | 'Medium' | 'Low'
  qron_id: string
  actions: string[]
  product: any
  supplyChain: any
  tokenId: number | null
  success: boolean
  message: string
  verifiedAt: string
  input: string
}

export function mapVerificationResponse(data: any, input: string): VerificationViewModel {
  const authentic = data?.success === true && data?.product?.isActive !== false
  const trustScore = authentic ? 96 : data?.success === true ? 30 : 10
  const confidence: 'High' | 'Medium' | 'Low' =
    trustScore >= 80 ? 'High' : trustScore >= 40 ? 'Medium' : 'Low'

  return {
    result: authentic ? 'authentic' : 'counterfeit',
    authentic,
    trust_score: trustScore,
    confidence,
    qron_id: data?.product?.productIdentifier || input,
    actions: authentic
      ? ['launch_ar', 'view_story', 'claim_ownership']
      : ['retry_scan', 'contact_support'],
    product: data?.product ?? null,
    supplyChain: data?.supplyChain ?? null,
    tokenId: typeof data?.tokenId === 'number' ? data.tokenId : null,
    success: Boolean(data?.success),
    message: data?.message || (authentic ? 'Verified' : 'Verification failed'),
    verifiedAt: new Date().toISOString(),
    input,
  }
}
