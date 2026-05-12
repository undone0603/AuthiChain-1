import { createServiceClient } from './supabase/service'

export interface LogPayload {
  vertical: string
  payload: Record<string, any>
  consensusScore: number
  status: 'SUCCESS' | 'FAILURE' | 'PENDING'
  errorMessage?: string
}

/**
 * Log an autonomous system event to Supabase.
 * This is the server-side equivalent of the AgentZ orchestrator's /api/log.
 */
export async function logAutonomousEvent(data: LogPayload) {
  const supabase = createServiceClient()
  
  // Generate payload hash
  const payloadString = JSON.stringify(data.payload)
  const encoder = new TextEncoder()
  const payloadData = encoder.encode(payloadString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', payloadData)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const payloadHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  const { error } = await supabase
    .from('autonomous_system_logs')
    .insert({
      vertical: data.vertical,
      payload_hash: payloadHash,
      consensus_score: data.consensusScore,
      status: data.status,
      error_message: data.errorMessage || null,
    })

  if (error) {
    console.error('[AgentZ] Logging failed:', error.message)
    throw error
  }
}
