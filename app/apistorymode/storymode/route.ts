import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// -----------------------------
// ZOD VALIDATION SCHEMA
// -----------------------------
const StorymodeSchema = z.object({
  product_id: z.string(),
  tone: z.string().default('cinematic'),
  story_type: z.string().default('provenance')
});

// -----------------------------
// SUPABASE CLIENT
// -----------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// -----------------------------
// DATA LAYER
// -----------------------------
async function getProduct(product_id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', product_id)
    .single();
  if (error) throw error;
  return data;
}

async function getVerificationEvents(product_id: string) {
  const { data, error } = await supabase
    .from('verification_events')
    .select('*')
    .eq('product_id', product_id)
    .order('timestamp', { ascending: true });
  if (error) throw error;
  return data;
}

async function getQronMetadata(qron_id: string | null) {
  if (!qron_id) return null;
  const { data, error } = await supabase
    .from('qron_metadata')
    .select('*')
    .eq('id', qron_id)
    .single();
  if (error) throw error;
  return data;
}

// -----------------------------
// PROMPT ENGINE
// -----------------------------
function buildPrompt({ product, verification, qron, tone, story_type }) {
  return `You are Storymode, the narrative engine of the AuthiChain Protocol.

Your job is to transform verified truth into cinematic narrative.

PRODUCT METADATA:
${JSON.stringify(product, null, 2)}

VERIFICATION EVENTS:
${JSON.stringify(verification, null, 2)}

QRON METADATA:
${JSON.stringify(qron, null, 2)}

STORY REQUIREMENTS:
- Tone: ${tone}
- Story Type: ${story_type}
- Must be grounded in blockchain timestamps, verification events, and product metadata.
- No hallucinated facts.
- Must read like a cinematic, emotionally resonant narrative.
- Must reinforce authenticity, provenance, and trust.

Begin streaming the story now.`;
}

// -----------------------------
// STREAMING ENGINE (SSE)
// -----------------------------
async function streamStory(prompt: string) {
  const encoder = new TextEncoder();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const stream = await openai.chat.completions.create({
    model: 'gpt-4.1',
    stream: true,
    messages: [
      { role: 'system', content: 'You are Storymode, the narrative engine of AuthiChain.' },
      { role: 'user', content: prompt }
    ]
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices?.[0]?.delta?.content || '';
        controller.enqueue(encoder.encode(`data: ${text}\n\n`));
      }
      controller.close();
    }
  });
}

// -----------------------------
// API ROUTE (STREAMING)
// -----------------------------
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = StorymodeSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { product_id, tone, story_type } = parsed.data;

    // Fetch truth anchors
    const product = await getProduct(product_id);
    const verification = await getVerificationEvents(product_id);
    const qron = await getQronMetadata(product.qron_id || null);

    // Build prompt
    const prompt = buildPrompt({ product, verification, qron, tone, story_type });

    // Stream story
    const stream = await streamStory(prompt);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      }
    });
  } catch (err) {
    console.error('Storymode Streaming Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
