/**
 * Shared Stripe V2 Account types + API version constant.
 * Used by the MCP server, CF workers, and Next.js API routes.
 */
import { z } from 'zod'

/** Canonical Stripe API version aligned with stripe@22.0.2 */
export const STRIPE_API_VERSION = '2026-03-25.dahlia' as const

// ─── V2 Account Create Input ─────────────────────────────────────────────────

export const V2AccountCreateInputSchema = z.object({
  email: z.string().email(),
  display_name: z.string().min(1).max(256),
  country: z.string().length(2).default('US'),
  entity_type: z.enum(['individual', 'company']).default('company'),
  metadata: z.record(z.string()).optional(),
})

export type V2AccountCreateInput = z.infer<typeof V2AccountCreateInputSchema>

// ─── V2 Account Response ─────────────────────────────────────────────────────

export const V2AccountSchema = z.object({
  id: z.string(),
  object: z.literal('v2.core.account'),
  applied_configurations: z.array(z.string()).optional(),
  configuration: z.record(z.unknown()).optional(),
  contact_email: z.string().nullable().optional(),
  created: z.string(),
  dashboard: z.string().nullable().optional(),
  defaults: z.record(z.unknown()).optional(),
  display_name: z.string().nullable().optional(),
  identity: z.record(z.unknown()).optional(),
  metadata: z.record(z.string()).optional(),
  requirements: z.record(z.unknown()).optional(),
})

export type V2Account = z.infer<typeof V2AccountSchema>
