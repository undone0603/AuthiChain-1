/**
 * Scheduled Jobs System — ported from authichain-unified
 *
 * Uses Vercel Cron to trigger job execution via /api/cron/* routes.
 * Each job logs its run to the scheduled_job_runs table.
 */
import { createServiceClient } from '@/lib/supabase/service'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface JobResult {
  itemsProcessed: number
  details: Record<string, unknown>
}

export interface JobInfo {
  name: string
  description: string
  schedule: string
  enabled: boolean
}

// ─── Job Execution Wrapper ──────────────────────────────────────────────────

export async function executeJob(jobName: string): Promise<void> {
  const handler = JOB_HANDLERS[jobName]
  if (!handler) {
    console.warn(`[Scheduler] Unknown job: ${jobName}`)
    return
  }

  const supabase = createServiceClient()
  const startTime = Date.now()
  console.log(`[Scheduler] Starting job: ${jobName}`)

  const { data: runRecord } = await supabase
    .from('scheduled_job_runs')
    .insert({ job_name: jobName, status: 'running' })
    .select('id')
    .single()

  const runId = runRecord?.id

  try {
    const result = await handler()
    const duration = Date.now() - startTime

    if (runId) {
      await supabase
        .from('scheduled_job_runs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          duration,
          items_processed: result.itemsProcessed,
          result: result.details,
        })
        .eq('id', runId)
    }

    console.log(`[Scheduler] Completed ${jobName} in ${duration}ms (${result.itemsProcessed} items)`)
  } catch (error: unknown) {
    const duration = Date.now() - startTime
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[Scheduler] Failed ${jobName}:`, message)

    if (runId) {
      await supabase
        .from('scheduled_job_runs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          duration,
          error: message,
        })
        .eq('id', runId)
    }
  }
}

// ─── Job Registry ───────────────────────────────────────────────────────────

const JOBS: JobInfo[] = [
  { name: 'subscription-health-check', description: 'Check expiring subscriptions, flag past-due accounts', schedule: '0 6 * * *', enabled: true },
  { name: 'certificate-expiry-check', description: 'Flag certificates expiring within 30 days', schedule: '0 7 * * *', enabled: true },
  { name: 'lead-nurturing', description: 'Sync unsynced leads to HubSpot', schedule: '0 9 * * *', enabled: true },
  { name: 'database-cleanup', description: 'Purge old notifications and stale job runs', schedule: '0 3 * * *', enabled: true },
  { name: 'weekly-analytics-digest', description: 'Compile weekly platform stats', schedule: '0 8 * * 1', enabled: true },
  { name: 'hubspot-crm-sync', description: 'Sync recent leads to HubSpot CRM', schedule: '0 */4 * * *', enabled: true },
  { name: 'customer-health-score', description: 'Recalculate customer health scores', schedule: '0 5 * * *', enabled: true },
  { name: 'fraud-detection-sweep', description: 'Detect suspicious authentication patterns', schedule: '0 */6 * * *', enabled: true },
  { name: 'autonomous-pipeline-tick', description: 'Revenue pipeline monitoring', schedule: '*/15 * * * *', enabled: false },
]

export function getRegisteredJobs(): JobInfo[] {
  return JOBS
}

// ─── Helper: safe table check ───────────────────────────────────────────────

async function tableExists(supabase: ReturnType<typeof createServiceClient>, table: string): Promise<boolean> {
  const { error } = await supabase.from(table).select('id').limit(1)
  return !error
}

// ─── JOB 1: Subscription Health Check ───────────────────────────────────────

export async function runSubscriptionHealthCheck(): Promise<JobResult> {
  const supabase = createServiceClient()
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  let processed = 0
  const details: Record<string, unknown> = {}

  // Find subscriptions expiring in 3 days
  const { data: expiringSubs } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan, current_period_end')
    .eq('status', 'active')
    .lte('current_period_end', threeDaysFromNow.toISOString())
    .gte('current_period_end', now.toISOString())

  for (const sub of expiringSubs ?? []) {
    await supabase.from('notifications').insert({
      user_id: sub.user_id,
      type: 'subscription',
      title: 'Subscription Expiring Soon',
      message: `Your ${sub.plan} subscription expires in less than 3 days. Renew to avoid service interruption.`,
      action_url: '/subscriptions',
    })
    processed++
  }
  details.expiringNotified = expiringSubs?.length ?? 0

  // Mark past-due subscriptions
  const { data: pastDueSubs } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('status', 'active')
    .lt('current_period_end', now.toISOString())

  for (const sub of pastDueSubs ?? []) {
    await supabase.from('subscriptions').update({ status: 'past_due' }).eq('id', sub.id)
    processed++
  }
  details.markedPastDue = pastDueSubs?.length ?? 0

  return { itemsProcessed: processed, details }
}

// ─── JOB 2: Certificate Expiry Check ────────────────────────────────────────

export async function runCertificateExpiryCheck(): Promise<JobResult> {
  const supabase = createServiceClient()

  if (!(await tableExists(supabase, 'certificates'))) {
    return { itemsProcessed: 0, details: { skipped: 'certificates table not found' } }
  }

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  let processed = 0

  const { data: expiringCerts } = await supabase
    .from('certificates')
    .select('id, user_id, certificate_number, expires_at')
    .eq('status', 'active')
    .lte('expires_at', thirtyDaysFromNow.toISOString())
    .gte('expires_at', now.toISOString())

  for (const cert of expiringCerts ?? []) {
    await supabase.from('notifications').insert({
      user_id: cert.user_id,
      type: 'certificate',
      title: 'Certificate Expiring Soon',
      message: `Certificate #${cert.certificate_number} expires on ${new Date(cert.expires_at).toLocaleDateString()}. Renew to maintain product authenticity.`,
      action_url: '/certificates',
    })
    processed++
  }

  // Auto-expire past-due certificates
  await supabase
    .from('certificates')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('expires_at', now.toISOString())

  return { itemsProcessed: processed, details: { expiringNotified: expiringCerts?.length ?? 0 } }
}

// ─── JOB 3: Lead Nurturing ──────────────────────────────────────────────────

export async function runLeadNurturing(): Promise<JobResult> {
  const supabase = createServiceClient()
  const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN
  let processed = 0
  const details: Record<string, unknown> = {}

  if (!hubspotToken) {
    return { itemsProcessed: 0, details: { skipped: 'HUBSPOT_ACCESS_TOKEN not set' } }
  }

  // Sync recent unsynced leads
  const { data: newLeads } = await supabase
    .from('leads')
    .select('id, email, source')
    .order('created_at', { ascending: false })
    .limit(20)

  let synced = 0
  for (const lead of newLeads ?? []) {
    try {
      await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${hubspotToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            email: lead.email,
            hs_lead_status: 'NEW',
            lead_source: lead.source || 'website',
          },
        }),
      })
      synced++
    } catch { /* skip failed syncs */ }
  }

  details.hubspotSynced = synced
  processed += synced

  return { itemsProcessed: processed, details }
}

// ─── JOB 4: Database Cleanup ────────────────────────────────────────────────

export async function runDatabaseCleanup(): Promise<JobResult> {
  const supabase = createServiceClient()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  let processed = 0
  const details: Record<string, unknown> = {}

  // Delete read notifications older than 30 days
  const { count: deletedNotifs } = await supabase
    .from('notifications')
    .delete({ count: 'exact' })
    .eq('is_read', true)
    .lt('created_at', thirtyDaysAgo)

  details.oldNotificationsDeleted = deletedNotifs ?? 0
  processed++

  // Delete completed job runs older than 90 days
  const { count: deletedRuns } = await supabase
    .from('scheduled_job_runs')
    .delete({ count: 'exact' })
    .eq('status', 'completed')
    .lt('started_at', ninetyDaysAgo)

  details.oldJobRunsDeleted = deletedRuns ?? 0
  processed++

  return { itemsProcessed: processed, details }
}

// ─── JOB 5: Weekly Analytics Digest ─────────────────────────────────────────

export async function runWeeklyDigest(): Promise<JobResult> {
  const supabase = createServiceClient()
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // Count new leads this week
  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneWeekAgo)

  // Count active subscriptions
  const { count: activeSubs } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // HubSpot CRM stats
  let crmStats = { contacts: 0, companies: 0, deals: 0 }
  const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN
  if (hubspotToken) {
    try {
      for (const obj of ['contacts', 'companies', 'deals'] as const) {
        const res = await fetch(`https://api.hubapi.com/crm/v3/objects/${obj}?limit=1`, {
          headers: { Authorization: `Bearer ${hubspotToken}` },
        })
        const data = await res.json()
        crmStats[obj] = data.total ?? 0
      }
    } catch { /* skip */ }
  }

  const details = {
    newLeads: newLeads ?? 0,
    activeSubs: activeSubs ?? 0,
    crmStats,
  }

  console.log(`[Scheduler] Weekly Digest: ${newLeads} new leads, ${activeSubs} active subs`)

  return { itemsProcessed: 1, details }
}

// ─── JOB 6: HubSpot CRM Sync ───────────────────────────────────────────────

export async function runHubSpotSync(): Promise<JobResult> {
  const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN
  if (!hubspotToken) {
    return { itemsProcessed: 0, details: { skipped: 'HUBSPOT_ACCESS_TOKEN not set' } }
  }

  const supabase = createServiceClient()
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  let synced = 0

  const { data: recentLeads } = await supabase
    .from('leads')
    .select('id, email, source')
    .gte('created_at', fourHoursAgo)
    .limit(50)

  for (const lead of recentLeads ?? []) {
    try {
      await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${hubspotToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            email: lead.email,
            lead_source: lead.source || 'website',
          },
        }),
      })
      synced++
    } catch { /* skip failed */ }
  }

  return { itemsProcessed: synced, details: { leadsFound: recentLeads?.length ?? 0, leadsSynced: synced } }
}

// ─── JOB 7: Customer Health Score ───────────────────────────────────────────

export async function runCustomerHealthScore(): Promise<JobResult> {
  const supabase = createServiceClient()
  let processed = 0

  const { data: activeSubs } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan, status')
    .eq('status', 'active')

  for (const sub of activeSubs ?? []) {
    // Base score by plan tier
    let score = 50
    if (sub.plan === 'enterprise') score = 80
    else if (sub.plan === 'pro' || sub.plan === 'professional') score = 65

    // Check trend against previous score
    const { data: existing } = await supabase
      .from('customer_health_scores')
      .select('score')
      .eq('user_id', sub.user_id)
      .order('last_calculated_at', { ascending: false })
      .limit(1)
      .single()

    let trend: 'improving' | 'stable' | 'declining' = 'stable'
    if (existing) {
      if (score > existing.score + 5) trend = 'improving'
      else if (score < existing.score - 5) trend = 'declining'
    }

    await supabase.from('customer_health_scores').insert({
      user_id: sub.user_id,
      score,
      factors: { plan: sub.plan },
      trend,
    })
    processed++
  }

  return { itemsProcessed: processed, details: { subscribersScored: processed } }
}

// ─── JOB 8: Fraud Detection ────────────────────────────────────────────────

export async function runFraudDetection(): Promise<JobResult> {
  const supabase = createServiceClient()

  if (!(await tableExists(supabase, 'authentications'))) {
    return { itemsProcessed: 0, details: { skipped: 'authentications table not found' } }
  }

  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  let flagged = 0

  // Use RPC or raw query for GROUP BY + HAVING since Supabase JS doesn't support it natively
  // For now, fetch recent authentications and group in memory
  const { data: recentAuths } = await supabase
    .from('authentications')
    .select('user_id, result')
    .gte('created_at', sixHoursAgo)

  if (recentAuths && recentAuths.length > 0) {
    // Group by user_id and count
    const userCounts: Record<string, number> = {}
    const counterfeitCounts: Record<string, number> = {}

    for (const auth of recentAuths) {
      if (auth.user_id) {
        userCounts[auth.user_id] = (userCounts[auth.user_id] ?? 0) + 1
      }
      if (auth.result === 'counterfeit' && auth.user_id) {
        counterfeitCounts[auth.user_id] = (counterfeitCounts[auth.user_id] ?? 0) + 1
      }
    }

    // Flag high-volume users (>50 auths in 6h)
    for (const [userId, count] of Object.entries(userCounts)) {
      if (count > 50) {
        await supabase.from('fraud_alerts').insert({
          user_id: userId,
          alert_type: 'high_volume_auth',
          severity: 'medium',
          description: `User performed ${count} authentications in the last 6 hours (threshold: 50).`,
          metadata: { authCount: count, period: '6h' },
        })
        flagged++
      }
    }

    // Flag users with multiple counterfeit flags (>5)
    for (const [userId, count] of Object.entries(counterfeitCounts)) {
      if (count > 5) {
        await supabase.from('fraud_alerts').insert({
          user_id: userId,
          alert_type: 'multiple_counterfeit_flags',
          severity: 'high',
          description: `User had ${count} counterfeit flags in the last 6 hours.`,
          metadata: { failCount: count, period: '6h' },
        })
        flagged++
      }
    }
  }

  return { itemsProcessed: flagged, details: { totalRecentAuths: recentAuths?.length ?? 0, flagged } }
}

// ─── JOB 9: Autonomous Pipeline Tick (disabled by default) ──────────────────

export async function runPipelineTick(): Promise<JobResult> {
  // Placeholder — the autonomous pipeline is managed by AgentZ
  return { itemsProcessed: 0, details: { skipped: 'Pipeline managed by AgentZ' } }
}

// ─── Handler Map ────────────────────────────────────────────────────────────

const JOB_HANDLERS: Record<string, () => Promise<JobResult>> = {
  'subscription-health-check': runSubscriptionHealthCheck,
  'certificate-expiry-check': runCertificateExpiryCheck,
  'lead-nurturing': runLeadNurturing,
  'database-cleanup': runDatabaseCleanup,
  'weekly-analytics-digest': runWeeklyDigest,
  'hubspot-crm-sync': runHubSpotSync,
  'customer-health-score': runCustomerHealthScore,
  'fraud-detection-sweep': runFraudDetection,
  'autonomous-pipeline-tick': runPipelineTick,
}
