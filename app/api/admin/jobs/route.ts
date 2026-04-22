import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getRegisteredJobs, executeJob } from '@/lib/scheduler'

export const dynamic = 'force-dynamic'

function isAuthorized(req: NextRequest): boolean {
  const key = req.headers.get('x-admin-api-key') ?? req.headers.get('authorization')?.replace('Bearer ', '')
  const adminKey = process.env.ADMIN_API_KEY
  if (!adminKey) return false
  return key === adminKey
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const jobs = getRegisteredJobs()

  const { data: recentRuns } = await supabase
    .from('scheduled_job_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ jobs, recentRuns: recentRuns ?? [] })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { jobName } = await req.json()
  if (!jobName || typeof jobName !== 'string') {
    return NextResponse.json({ error: 'jobName required' }, { status: 400 })
  }

  const jobs = getRegisteredJobs()
  if (!jobs.find(j => j.name === jobName)) {
    return NextResponse.json({ error: `Unknown job: ${jobName}` }, { status: 404 })
  }

  try {
    await executeJob(jobName)
    return NextResponse.json({ success: true, jobName })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Job failed' }, { status: 500 })
  }
}
