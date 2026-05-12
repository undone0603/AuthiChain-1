"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle2, AlertCircle, Clock, Terminal } from "lucide-react"

interface Log {
  id: string
  vertical: string
  payload_hash: string
  consensus_score: number
  status: string
  error_message: string | null
  timestamp: string
}

export function AgentZLogs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/logs?limit=10")
      if (res.ok) {
        const data = await res.json()
        setLogs(data)
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm text-slate-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/20 rounded-md">
              <Terminal className="h-4 w-4 text-indigo-400" />
            </div>
            <CardTitle className="text-lg">AgentZ Autonomous Feed</CardTitle>
          </div>
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 font-mono text-[10px]">
            v4.0.1-orchestrator
          </Badge>
        </div>
        <CardDescription className="text-slate-400">
          Real-time system orchestration and revenue pipeline events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] pr-4 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
          <div className="space-y-3">
            {loading && logs.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-slate-500">
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Initializing AgentZ feed...
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No autonomous events recorded yet.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-3 text-xs border-b border-slate-800 pb-3 last:border-0">
                  <div className="mt-0.5">
                    {log.status === 'SUCCESS' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-indigo-400 uppercase tracking-tighter">
                        {log.vertical.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-slate-300 font-medium">
                      Consensus Score: <span className="text-emerald-400">{(log.consensus_score * 100).toFixed(1)}%</span>
                    </div>
                    {log.error_message && (
                      <div className="text-rose-400 bg-rose-400/10 p-1.5 rounded text-[10px] font-mono">
                        {log.error_message}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="font-mono bg-slate-800 px-1 rounded">SHA256:{log.payload_hash.substring(0, 8)}...</span>
                      <span>•</span>
                      <span className="capitalize">{log.status.toLowerCase()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
