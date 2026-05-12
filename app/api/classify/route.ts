import { NextRequest, NextResponse } from 'next/server'
import { logAutonomousEvent } from '@/lib/logs'

const CF = process.env.CF_WORKER_URL || 'https://authichain-unified.undone-k.workers.dev'

export async function POST(r: NextRequest) {
  const b = await r.json().catch(() => ({}))
  
  try {
    const res = await fetch(`${CF}/api/classify`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(b) 
    })
    
    const data = await res.json()
    
    // Log classification event to AgentZ autonomous feed
    if (res.ok) {
      await logAutonomousEvent({
        vertical: 'AI_CLASSIFICATION',
        payload: { 
          imageUrl: b.imageUrl?.substring(0, 50) + '...',
          industryId: data.industryId,
          confidence: data.confidence,
          category: data.category
        },
        consensusScore: (data.confidence || 0) / 100,
        status: 'SUCCESS'
      }).catch(err => console.error('[AgentZ] Logging failed:', err))
    } else {
      await logAutonomousEvent({
        vertical: 'AI_CLASSIFICATION',
        payload: { error: data.error || 'Unknown error' },
        consensusScore: 0,
        status: 'FAILURE',
        errorMessage: data.error
      }).catch(err => console.error('[AgentZ] Logging failed:', err))
    }
    
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
