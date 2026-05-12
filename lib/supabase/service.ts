import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client that bypasses RLS.
 * Use only in server-side webhook/background handlers — never expose to the client.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  if (!url || !key) {
    throw new Error('Supabase URL and Key (service or anon) are required')
  }

  return createClient(
    url,
    key,
    { auth: { persistSession: false } }
  )
}
