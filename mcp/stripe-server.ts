#!/usr/bin/env npx tsx
/**
 * AuthiChain Stripe MCP Server
 *
 * Exposes 4 tools over stdio transport:
 *   - stripe_create_v2_account
 *   - stripe_get_v2_account
 *   - stripe_list_webhook_events
 *   - stripe_get_subscription
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import Stripe from 'stripe'
import { z } from 'zod'
import { STRIPE_API_VERSION, V2AccountCreateInputSchema } from '../lib/stripe-v2-types'

// ─── Config ──────────────────────────────────────────────────────────────────

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
if (!STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is required')
  process.exit(1)
}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || ''
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'app4lw5wNMNmzTNMn'

const stripe = new Stripe(STRIPE_SECRET_KEY)

// ─── Airtable helper ─────────────────────────────────────────────────────────

function escapeAirtableValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

async function airtableRequest(
  table: string,
  method: 'GET' | 'POST' | 'PATCH',
  body?: object,
  params?: string
) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}${params || ''}`
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Airtable ${method} ${table} failed: ${err}`)
  }
  return res.json()
}

// ─── V2 Account helpers (raw fetch — SDK v22 may not expose v2 endpoints) ───

async function createV2Account(input: z.infer<typeof V2AccountCreateInputSchema>) {
  const res = await fetch('https://api.stripe.com/v2/core/accounts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/json',
      'Stripe-Version': STRIPE_API_VERSION,
    },
    body: JSON.stringify({
      contact_email: input.email,
      display_name: input.display_name,
      country: input.country,
      configuration: {
        customer: { automatic_indirect_tax: { exempt: 'none' } },
      },
      identity: {
        entity_type: input.entity_type,
        country: input.country,
      },
      defaults: { responsibilities: { collect_tax_automatically: false } },
      ...(input.metadata ? { metadata: input.metadata } : {}),
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Stripe V2 create account failed (${res.status}): ${err}`)
  }
  return res.json()
}

async function getV2Account(accountId: string, includes?: string[]) {
  const qs = includes?.length ? `?include[]=${includes.join('&include[]=')}` : ''
  const res = await fetch(`https://api.stripe.com/v2/core/accounts/${accountId}${qs}`, {
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Stripe-Version': STRIPE_API_VERSION,
    },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Stripe V2 get account failed (${res.status}): ${err}`)
  }
  return res.json()
}

// ─── MCP Server ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'authichain-stripe',
  version: '1.0.0',
})

// Tool 1: Create V2 Account
server.tool(
  'stripe_create_v2_account',
  'Create a Stripe V2 Connected Account for a brand partner',
  {
    email: z.string().email().describe('Contact email for the account'),
    display_name: z.string().describe('Business display name'),
    country: z.string().length(2).default('US').describe('ISO 3166-1 alpha-2 country code'),
    entity_type: z.enum(['individual', 'company']).default('company').describe('Business entity type'),
  },
  async (params) => {
    try {
      const account = await createV2Account(params)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(account, null, 2) }],
      }
    } catch (err: any) {
      return {
        content: [{ type: 'text' as const, text: `Error: ${err.message}` }],
        isError: true,
      }
    }
  }
)

// Tool 2: Get V2 Account
server.tool(
  'stripe_get_v2_account',
  'Retrieve a Stripe V2 Connected Account by ID',
  {
    account_id: z.string().describe('The V2 account ID (acct_...)'),
    includes: z.array(z.string()).optional().describe('Optional includes (e.g. ["requirements"])'),
  },
  async (params) => {
    try {
      const account = await getV2Account(params.account_id, params.includes)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(account, null, 2) }],
      }
    } catch (err: any) {
      return {
        content: [{ type: 'text' as const, text: `Error: ${err.message}` }],
        isError: true,
      }
    }
  }
)

// Tool 3: List Webhook Events from Airtable Events Log
server.tool(
  'stripe_list_webhook_events',
  'Query the Airtable Events Log for Stripe webhook events',
  {
    event_type: z.string().optional().describe('Filter by Stripe event type (e.g. "checkout.session.completed")'),
    status: z.enum(['success', 'error']).optional().describe('Filter by processing status'),
    limit: z.number().min(1).max(100).default(20).describe('Max records to return'),
  },
  async (params) => {
    try {
      if (!AIRTABLE_API_KEY) {
        return {
          content: [{ type: 'text' as const, text: 'Error: AIRTABLE_API_KEY not configured' }],
          isError: true,
        }
      }

      const filters: string[] = []
      if (params.event_type) {
        filters.push(`{Event Type}="${escapeAirtableValue(params.event_type)}"`)
      }
      if (params.status) {
        filters.push(`{Status}="${escapeAirtableValue(params.status)}"`)
      }

      const formula = filters.length > 1
        ? `AND(${filters.join(',')})`
        : filters.length === 1
          ? filters[0]
          : ''

      const qs = formula
        ? `?filterByFormula=${encodeURIComponent(formula)}&maxRecords=${params.limit}&sort%5B0%5D%5Bfield%5D=Date&sort%5B0%5D%5Bdirection%5D=desc`
        : `?maxRecords=${params.limit}&sort%5B0%5D%5Bfield%5D=Date&sort%5B0%5D%5Bdirection%5D=desc`

      const data = await airtableRequest('Events Log', 'GET', undefined, qs)
      const records = (data.records || []).map((r: any) => r.fields)

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(records, null, 2) }],
      }
    } catch (err: any) {
      return {
        content: [{ type: 'text' as const, text: `Error: ${err.message}` }],
        isError: true,
      }
    }
  }
)

// Tool 4: Get Subscription by Customer ID
server.tool(
  'stripe_get_subscription',
  'List active Stripe subscriptions for a customer',
  {
    customer_id: z.string().describe('Stripe customer ID (cus_...)'),
    status: z.enum(['active', 'trialing', 'past_due', 'canceled', 'all']).default('active').describe('Subscription status filter'),
  },
  async (params) => {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: params.customer_id,
        status: params.status === 'all' ? undefined : params.status,
        limit: 10,
        expand: ['data.items.data.price.product'],
      })

      const result = subscriptions.data.map((sub) => ({
        id: sub.id,
        status: sub.status,
        current_period_end: sub.items.data[0]?.current_period_end
          ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
          : null,
        items: sub.items.data.map((item) => ({
          price_id: item.price.id,
          unit_amount: item.price.unit_amount,
          currency: item.price.currency,
          interval: item.price.recurring?.interval,
          product: typeof item.price.product === 'object' && item.price.product !== null
            ? (item.price.product as Stripe.Product).name
            : item.price.product,
        })),
        metadata: sub.metadata,
      }))

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      }
    } catch (err: any) {
      return {
        content: [{ type: 'text' as const, text: `Error: ${err.message}` }],
        isError: true,
      }
    }
  }
)

// ─── Start ───────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('AuthiChain Stripe MCP server running on stdio')
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
