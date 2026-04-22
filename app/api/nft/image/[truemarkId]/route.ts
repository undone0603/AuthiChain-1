/**
 * GET /api/nft/image/[truemarkId]
 *
 * Serves the artwork image for an NFT Certificate of Authenticity.
 * Lookup order:
 *   1. Product's stored image_url (Supabase) → 302 redirect
 *   2. Static Voyage Bloom artwork matched by product name slug
 *   3. Default placeholder SVG inline
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

// Slug → static asset path mapping for known Voyage Bloom NFTs
const VOYAGE_BLOOM_ARTWORK: Record<string, string> = {
  'bling-blaow':          '/images/nft/diamond-nft.svg',
  'diamond':              '/images/nft/diamond-nft.svg',
  'cosmic-cookie':        '/images/nft/cosmic-cookie-nft.svg',
  'myles-high':           '/images/nft/myles-high-nft.svg',
  'watermelon-zmartini':  '/images/nft/watermelon-zmartini-nft.svg',
  'jared':                '/images/nft/jared-nft.svg',
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function matchArtwork(productName: string): string | null {
  const slug = toSlug(productName)
  // Exact match first
  if (VOYAGE_BLOOM_ARTWORK[slug]) return VOYAGE_BLOOM_ARTWORK[slug]
  // Partial match
  for (const key of Object.keys(VOYAGE_BLOOM_ARTWORK)) {
    if (slug.includes(key) || key.includes(slug)) return VOYAGE_BLOOM_ARTWORK[key]
  }
  return null
}

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#213355"/>
      <stop offset="100%" stop-color="#14213d"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="400" cy="400" r="300" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.3"/>
  <text x="400" y="380" font-family="Arial,sans-serif" font-size="80" text-anchor="middle" fill="#FFD700">✦</text>
  <text x="400" y="460" font-family="Arial,sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#FFFFFF">AuthiChain</text>
  <text x="400" y="500" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#CCCCCC">Certificate of Authenticity</text>
</svg>`

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ truemarkId: string }> }
) {
  const { truemarkId } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'

  try {
    const supabase = createServiceClient()
    const { data: product } = await supabase
      .from('products')
      .select('name, image_url')
      .eq('truemark_id', truemarkId)
      .single()

    // 1. Use product's stored image if available
    if (product?.image_url) {
      return NextResponse.redirect(product.image_url, { status: 302 })
    }

    // 2. Match against known Voyage Bloom artwork
    if (product?.name) {
      const artworkPath = matchArtwork(product.name)
      if (artworkPath) {
        return NextResponse.redirect(`${baseUrl}${artworkPath}`, { status: 302 })
      }
    }
  } catch {
    // Fall through to placeholder
  }

  // 3. Serve inline placeholder SVG
  return new NextResponse(PLACEHOLDER_SVG, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
