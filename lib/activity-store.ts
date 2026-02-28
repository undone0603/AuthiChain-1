import { mkdir, readFile, appendFile } from 'fs/promises'
import path from 'path'

export type ActivityEvent = {
  type: string
  timestamp: string
  details?: Record<string, unknown>
}

const DATA_DIR = path.join(process.cwd(), '.data')
const EVENTS_FILE = path.join(DATA_DIR, 'activity-events.jsonl')

export async function writeActivityEvent(event: ActivityEvent) {
  await mkdir(DATA_DIR, { recursive: true })
  await appendFile(EVENTS_FILE, `${JSON.stringify(event)}\n`, 'utf8')
}

export async function readRecentActivityEvents(limit = 100): Promise<ActivityEvent[]> {
  try {
    const raw = await readFile(EVENTS_FILE, 'utf8')
    return raw
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as ActivityEvent
        } catch {
          return null
        }
      })
      .filter((item): item is ActivityEvent => Boolean(item))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  } catch {
    return []
  }
}
