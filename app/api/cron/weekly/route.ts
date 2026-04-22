import { NextRequest, NextResponse } from 'next/server'
import { executeJob } from '@/lib/scheduler'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await executeJob('weekly-analytics-digest')
    return NextResponse.json({ ran: 1, results: { 'weekly-analytics-digest': 'ok' } })
  } catch (err) {
    return NextResponse.json({ ran: 1, results: { 'weekly-analytics-digest': err instanceof Error ? err.message : 'failed' } })
  }
}
