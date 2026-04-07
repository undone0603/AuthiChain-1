/**
 * Full StoryMode workflow test — end-to-end pipeline.
 *
 * Stage 1: Fetch product + supply chain events from Supabase
 * Stage 2: Generate cinematic narration script via GPT-4
 * Stage 3: Send script to HeyGen for avatar video production
 * Stage 4: Poll HeyGen until video is ready (or timeout)
 *
 * Run: node scripts/test-storymode-pipeline.mjs
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config() // fallback to .env

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY
const HEYGEN_KEY = process.env.HEYGEN_API_KEY

const PRODUCT_ID = process.argv[2] || 'a1000001-0001-4000-a000-000000000002' // Patek Philippe

console.log('═══════════════════════════════════════════════════════')
console.log('  AuthiChain StoryMode — Full Pipeline Test')
console.log('═══════════════════════════════════════════════════════')
console.log(`  Product ID: ${PRODUCT_ID}`)
console.log(`  Supabase:   ${SUPABASE_URL ? '✓' : '✗ MISSING'}`)
console.log(`  OpenAI:     ${OPENAI_KEY ? '✓' : '✗ MISSING'}`)
console.log(`  HeyGen:     ${HEYGEN_KEY ? '✓' : '✗ MISSING'}`)
console.log('═══════════════════════════════════════════════════════\n')

// ── Stage 1: Supabase ────────────────────────────────────────────────────────

console.log('▶ STAGE 1: Fetching product from Supabase...')

const productRes = await fetch(
  `${SUPABASE_URL}/rest/v1/products?id=eq.${PRODUCT_ID}&select=name,brand,category,truemark_id,blockchain_tx_hash,created_at`,
  { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
)
const [product] = await productRes.json()

if (!product) { console.error('  ✗ Product not found'); process.exit(1) }
console.log(`  ✓ Product: ${product.name} by ${product.brand}`)
console.log(`    Category:  ${product.category}`)
console.log(`    TrueMark:  ${product.truemark_id}`)
console.log(`    TX Hash:   ${product.blockchain_tx_hash?.slice(0, 20)}...`)

const eventsRes = await fetch(
  `${SUPABASE_URL}/rest/v1/supply_chain_events?product_id=eq.${PRODUCT_ID}&select=event_type,location,actor_name,description,timestamp&order=timestamp.asc`,
  { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
)
const events = await eventsRes.json()
console.log(`  ✓ Supply chain events: ${events.length}`)
events.forEach(e => console.log(`    • ${e.event_type} — ${e.location} (${e.actor_name})`))

console.log('\n─────────────────────────────────────────────────────\n')

// ── Stage 2: GPT-4 Script ────────────────────────────────────────────────────

console.log('▶ STAGE 2: Generating cinematic script via GPT-4...')

if (!OPENAI_KEY) { console.error('  ✗ OPENAI_API_KEY not set — skipping'); process.exit(1) }

const eventsBlock = events.map(e => `- ${e.event_type} at ${e.location} by ${e.actor_name}: ${e.description}`).join('\n')

const prompt = `You are a world-class documentary narrator — think David Attenborough meets a luxury brand film director.

Write a cinematic, theatrical narration script for a product origin story video. The script will be read aloud by a single narrator avatar in a 60-90 second video.

PRODUCT DATA:
- Name: ${product.name}
- Brand: ${product.brand}
- Category: ${product.category}
- TrueMark™ ID: ${product.truemark_id}
- Blockchain TX: ${product.blockchain_tx_hash?.slice(0, 16)}...

SUPPLY CHAIN JOURNEY:
${eventsBlock}

REQUIREMENTS:
1. Open with a dramatic, attention-grabbing hook about the product's origin
2. Build a narrative arc: origin → craftsmanship → quality verification → journey to consumer
3. Weave in blockchain verification naturally — make it sound prestigious, not technical
4. Use sensory language — textures, landscapes, craftsmanship
5. End with a powerful closing line about authenticity and trust
6. Keep it 150-200 words (60-90 seconds when spoken)
7. Do NOT include stage directions or speaker labels — just narration text
8. Write in present tense for immediacy and drama

Return ONLY the narration script, nothing else.`

const t0 = Date.now()
const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.85,
    max_tokens: 500,
  }),
})
const gptData = await gptRes.json()

if (!gptRes.ok) {
  console.error('  ✗ GPT-4 error:', gptData.error?.message || JSON.stringify(gptData))
  process.exit(1)
}

const script = gptData.choices[0].message.content.trim()
const scriptTime = ((Date.now() - t0) / 1000).toFixed(1)
const wordCount = script.split(/\s+/).length

console.log(`  ✓ Script generated in ${scriptTime}s (${wordCount} words)`)
console.log(`  ✓ Est. narration time: ~${Math.round(wordCount / 2.5)}s`)
console.log('\n  ┌─── NARRATION SCRIPT ───────────────────────────────')
script.split('\n').forEach(line => console.log(`  │ ${line}`))
console.log('  └────────────────────────────────────────────────────\n')
console.log('─────────────────────────────────────────────────────\n')

// ── Stage 3: HeyGen Video ────────────────────────────────────────────────────

console.log('▶ STAGE 3: Sending to HeyGen for video production...')

if (!HEYGEN_KEY) { console.error('  ✗ HEYGEN_API_KEY not set — skipping'); process.exit(1) }

const heygenPayload = {
  video_inputs: [{
    character: { type: 'avatar', avatar_id: 'Daisy-inskirt-20220818', avatar_style: 'normal' },
    voice: { type: 'text', input_text: script, voice_id: 'en-US-ChristopherNeural', speed: 0.95 },
    background: { type: 'color', value: '#0a0a0a' },
  }],
  dimension: { width: 1920, height: 1080 },
  aspect_ratio: '16:9',
  test: false,
}

const t1 = Date.now()
const hgRes = await fetch('https://api.heygen.com/v2/video/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Api-Key': HEYGEN_KEY },
  body: JSON.stringify(heygenPayload),
})
const hgData = await hgRes.json()

if (!hgRes.ok || !hgData.data?.video_id) {
  console.error('  ✗ HeyGen error:', hgData.error || hgData.message || JSON.stringify(hgData))
  process.exit(1)
}

const videoId = hgData.data.video_id
console.log(`  ✓ Video queued in ${((Date.now() - t1) / 1000).toFixed(1)}s`)
console.log(`    Video ID: ${videoId}`)
console.log('\n─────────────────────────────────────────────────────\n')

// ── Stage 4: Poll for completion ─────────────────────────────────────────────

console.log('▶ STAGE 4: Polling HeyGen for video completion...')
console.log('  (polling every 10s, timeout 5min)\n')

const MAX_POLLS = 30
let videoUrl = null

for (let i = 1; i <= MAX_POLLS; i++) {
  await new Promise(r => setTimeout(r, 10000))

  const statusRes = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
    headers: { 'X-Api-Key': HEYGEN_KEY },
  })
  const statusData = await statusRes.json()
  const status = statusData.data?.status

  process.stdout.write(`  [${i}/${MAX_POLLS}] Status: ${status}`)

  if (status === 'completed') {
    videoUrl = statusData.data.video_url
    const duration = statusData.data.duration
    const thumbnail = statusData.data.thumbnail_url
    console.log(' ✓\n')
    console.log('═══════════════════════════════════════════════════════')
    console.log('  ✓ PIPELINE COMPLETE — Video Ready!')
    console.log('═══════════════════════════════════════════════════════')
    console.log(`  Video URL:     ${videoUrl}`)
    console.log(`  Thumbnail:     ${thumbnail}`)
    console.log(`  Duration:      ${duration}s`)
    console.log(`  Product:       ${product.name}`)
    console.log(`  TrueMark™ ID:  ${product.truemark_id}`)
    console.log(`  StoryMode URL: https://authichain.com/storymode/viewer?product_id=${PRODUCT_ID}`)
    console.log('═══════════════════════════════════════════════════════')
    break
  } else if (status === 'failed') {
    console.log(' ✗ FAILED')
    console.error('  Video generation failed:', JSON.stringify(statusData.data))
    process.exit(1)
  } else {
    console.log('')
  }
}

if (!videoUrl) {
  console.log('\n  ⏱ Timeout — video still processing. Check manually:')
  console.log(`    curl -H "X-Api-Key: $HEYGEN_API_KEY" "https://api.heygen.com/v1/video_status.get?video_id=${videoId}"`)
}
