/**
 * Authentic Economy Orchestrator (AgentZ)
 * 
 * Central hub for:
 * 1. Autonomous System Logging (AgentZ)
 * 2. Cross-Platform Entitlement Verification
 * 3. Authentic Economy Revenue Routing
 */

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health Check
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        service: 'authentic-economy-orchestrator',
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // AgentZ Autonomous System Logging
    // POST /api/log
    if (url.pathname === '/api/log' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const { vertical, payload, consensus_score, status, error_message } = body;

        if (!vertical || !payload || consensus_score === undefined || !status) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
            status: 400, 
            headers: corsHeaders 
          });
        }

        // Generate payload hash
        const payloadString = JSON.stringify(payload);
        const encoder = new TextEncoder();
        const data = encoder.encode(payloadString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const payloadHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Store in Supabase
        const supabaseUrl = env.SUPABASE_URL;
        const supabaseKey = env.SUPABASE_ANON_KEY;

        const res = await fetch(`${supabaseUrl}/rest/v1/autonomous_system_logs`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            vertical,
            payload_hash: payloadHash,
            consensus_score,
            status,
            error_message: error_message || null
          })
        });

        if (!res.ok) {
          const errorText = await res.text();
          return new Response(JSON.stringify({ error: 'Supabase logging failed', details: errorText }), { 
            status: 500, 
            headers: corsHeaders 
          });
        }

        const result = await res.json() as any[];
        return new Response(JSON.stringify({ success: true, log: result[0] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { 
          status: 500, 
          headers: corsHeaders 
        });
      }
    }

    // Economy Summary
    // GET /api/economy/summary
    if (url.pathname === '/api/economy/summary' && request.method === 'GET') {
      return new Response(JSON.stringify({
        platforms: ['authichain', 'qron', 'strainchain'],
        token: 'QRON',
        base_unit_cost: 0.05,
        split_ratios: { staker: 0.40, treasury: 0.40, burn: 0.20 }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), { 
      status: 404, 
      headers: corsHeaders 
    });
  }
};
