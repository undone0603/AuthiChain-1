import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()

  const { data: config } = await supabase
    .from('autopilot_config')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single()

  const { data: decisions } = await supabase
    .from('autopilot_decisions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const executed = (decisions ?? []).filter(d => d.status === 'executed').length
  const total = decisions?.length ?? 0

  return NextResponse.json({
    enabled: config?.enabled ?? false,
    mode: config?.mode ?? 'balanced',
    guardrails: config?.guardrails,
    decisionsToday: total,
    actionsToday: executed,
    successRate: total > 0 ? Math.round((executed / total) * 100) : 0,
    recentDecisions: decisions ?? [],
  })
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createServiceClient()

  // Toggle enable/disable
  if (body.action === 'toggle') {
    const { data: existing } = await supabase
      .from('autopilot_config')
      .select('id, enabled')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    const newEnabled = !(existing?.enabled ?? false)

    if (existing) {
      await supabase.from('autopilot_config').update({
        enabled: newEnabled,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('autopilot_config').insert({
        enabled: newEnabled,
        mode: 'balanced',
        guardrails: { maxEmailsPerDay: 50, maxSocialPostsPerDay: 5, maxDiscountPercent: 30 },
        updated_by: user.id,
      })
    }

    return NextResponse.json({ success: true, enabled: newEnabled })
  }

  // Update mode
  if (body.action === 'updateMode' && body.mode) {
    const validModes = ['conservative', 'balanced', 'aggressive']
    if (!validModes.includes(body.mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('autopilot_config')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    if (existing) {
      await supabase.from('autopilot_config').update({
        mode: body.mode,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('autopilot_config').insert({
        enabled: false,
        mode: body.mode,
        updated_by: user.id,
      })
    }

    return NextResponse.json({ success: true })
  }

  // Execute action with LLM evaluation
  if (body.action === 'execute' && body.type && body.actionText) {
    const openai = new OpenAI()

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an AI business autopilot. Evaluate the proposed action and determine confidence level (0-100) and expected outcome.' },
        { role: 'user', content: `Action type: ${body.type}\nAction: ${body.actionText}\nReasoning: ${body.reasoning || 'N/A'}` },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'action_evaluation',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              confidence: { type: 'integer' },
              expectedOutcome: { type: 'string' },
              risks: { type: 'string' },
              proceed: { type: 'boolean' },
            },
            required: ['confidence', 'expectedOutcome', 'risks', 'proceed'],
            additionalProperties: false,
          },
        },
      },
    })

    const evaluation = JSON.parse(response.choices[0].message.content as string)

    const { data: decision } = await supabase
      .from('autopilot_decisions')
      .insert({
        type: body.type,
        action: body.actionText,
        reasoning: body.reasoning,
        confidence: evaluation.confidence,
        status: evaluation.proceed ? 'executed' : 'pending',
        result: evaluation,
      })
      .select('id')
      .single()

    return NextResponse.json({ decision, evaluation })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { decisionId, reason } = await req.json()
  if (!decisionId || !reason) {
    return NextResponse.json({ error: 'decisionId and reason required' }, { status: 400 })
  }

  const supabase = createServiceClient()
  await supabase
    .from('autopilot_decisions')
    .update({
      status: 'overridden',
      overridden_by: user.id,
      override_reason: reason,
    })
    .eq('id', decisionId)

  return NextResponse.json({ success: true })
}
