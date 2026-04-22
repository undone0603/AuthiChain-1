import { NextRequest, NextResponse } from 'next/server'
import { executeJob } from '@/lib/scheduler'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobs = [
    'subscription-health-check',
    'certificate-expiry-check',
    'lead-nurturing',
    'database-cleanup',
    'customer-health-score',
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
