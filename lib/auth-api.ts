import { createClient } from './supabase/server'

export interface ApiKeyValidation {
  valid: boolean
  userId?: string
  keyName?: string
  error?: string
}

/**
 * Validates an AuthiChain API key against the Supabase database.
 * Supports both X-API-Key header and Bearer token.
 */
export async function validateApiKey(req: Request): Promise<ApiKeyValidation> {
  const apiKey = req.headers.get('X-API-Key') || req.headers.get('Authorization')?.replace('Bearer ', '')

  if (!apiKey) {
    return { valid: false, error: 'Missing API key' }
  }

  // Handle Demo Keys
  if (apiKey === 'demo_test_key_2026') {
    return { valid: true, userId: 'demo', keyName: 'Demo Key' }
  }

  try {
    const supabase = await createClient()
    
    // In production, you would ideally use a hashed version of the key.
    // For this implementation, we query by the raw key.
    const { data, error } = await supabase
      .from('api_keys')
      .select('user_id, key_name, status')
      .eq('api_key', apiKey)
      .single()

    if (error || !data) {
      return { valid: false, error: 'Invalid API key' }
    }

    if (data.status !== 'active') {
      return { valid: false, error: 'API key is inactive' }
    }

    return {
      valid: true,
      userId: data.user_id,
      keyName: data.key_name
    }
  } catch (err) {
    console.error('[auth-api] Validation error:', err)
    return { valid: false, error: 'Internal validation error' }
  }
}
