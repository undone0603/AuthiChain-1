import { NextRequest, NextResponse } from 'next/server'
import { executeJob } from '@/lib/scheduler'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Hobby plan: single daily cron runs all jobs.
  // Monday-only jobs check the day internally.
  const dayOfWeek = new Date().getUTCDay() // 0=Sun, 1=Mon

  const jobs = [
    // Core daily jobs
    'subscription-health-check',
    'certificate-expiry-check',
    'lead-nurturing',
    'database-cleanup',
    'customer-health-score',
    // Previously "frequent" (every 4h) — run once daily instead
    'hubspot-crm-sync',
    'fraud-detection-sweep',
    // Weekly digest — Monday only
    ...(dayOfWeek === 1 ? ['weekly-analytics-digest'] : []),
  ]

  const results: Record<string, string> = {}
  for (const job of jobs) {
    try {
      await executeJob(job)
      results[job] = 'ok'
    } catch (err) {
      results[job] = err instanceof Error ? err.message : 'failed'
    }
  }

  return NextResponse.json({ ran: jobs.length, results })
}
