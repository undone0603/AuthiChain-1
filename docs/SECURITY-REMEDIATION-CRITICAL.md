# 🔴 CRITICAL SECURITY REMEDIATION — Hardcoded Secrets in Cloudflare Workers

**Date**: April 13, 2026
**Priority**: P0 — DO THIS BEFORE ANYTHING ELSE
**Estimated Time**: 45 minutes total

## Summary

A full audit of all 23 Cloudflare Workers found **5 hardcoded API keys/tokens** across 3 Workers.
The most critical is a **live Stripe secret key** (`sk_live_*`) in `qron-daily-ops` which grants
full access to your Stripe account (charges, refunds, customer data, payouts).

## Affected Workers

### 1. qron-daily-ops — 🔴🔴 MOST CRITICAL
**Hardcoded secrets (4):**
- `GROQ` — Groq API key (`gsk_z25q...`)
- `STRIPE` — **LIVE Stripe secret key** (`sk_live_51SXI...`)
- `SUPA_A` — Supabase anon JWT
- `GMAIL` / `RESEND_RELAY` — relay URLs (less critical but should be env vars)

**Fix:**
1. **IMMEDIATELY rotate the Stripe key** at dashboard.stripe.com → Developers → API keys → Roll key
2. In Cloudflare Dashboard → Workers → qron-daily-ops → Settings → Variables and Secrets:
   - Add `GROQ_API_KEY` as **Secret** (encrypted)
   - Add `STRIPE_SECRET_KEY` as **Secret** (encrypted)
   - Add `SUPABASE_ANON_KEY` as **Secret** (encrypted)
   - Add `SUPABASE_URL` as plain text = `https://nhdnkzhtadfkkluiulhs.supabase.co/functions/v1`
   - Add `GMAIL_RELAY_URL` as plain text
   - Add `RESEND_RELAY_URL` as plain text
3. Replace in Worker code:
   ```js
   // BEFORE (INSECURE):
   const GROQ  = 'gsk_z25q...';
   const STRIPE= 'sk_live_51SXI...';
   const SUPA_A= 'eyJhbG...';
   
   // AFTER (SECURE — use env parameter):
   // In fetch(request, env) and scheduled(event, env, ctx):
   const GROQ   = env.GROQ_API_KEY;
   const STRIPE = env.STRIPE_SECRET_KEY;
   const SUPA_A = env.SUPABASE_ANON_KEY;
   const SUPA   = env.SUPABASE_URL || 'https://nhdnkzhtadfkkluiulhs.supabase.co/functions/v1';
   ```
4. Move these declarations INSIDE the handler functions (they need `env` which is a parameter)

### 2. resend-relay — 🔴 CRITICAL
**Hardcoded secret (1):**
- `RESEND_KEY` — Resend API key (`re_Lc5G2g2X_...`)

**Fix:**
1. Rotate key at resend.com → API Keys → Create new key, delete old one
2. In Cloudflare Dashboard → Workers → resend-relay → Settings → Variables and Secrets:
   - Add `RESEND_API_KEY` as **Secret** (encrypted)
3. Replace in Worker code:
   ```js
   // BEFORE:
   const RESEND_KEY = 're_Lc5G2g2X_...';
   
   // AFTER (in fetch handler):
   export default {
     async fetch(req, env) {
       const RESEND_KEY = env.RESEND_API_KEY;
       // ... rest of handler
     }
   };
   ```

### 3. gmail-relay-z — 🟡 HIGH
**Hardcoded secret (1):**
- `SUPA_ANON` — Supabase anon JWT (same key as in qron-daily-ops)

**Fix:**
1. In Cloudflare Dashboard → Workers → gmail-relay-z → Settings → Variables and Secrets:
   - Add `SUPABASE_ANON_KEY` as **Secret** (encrypted)
   - Add `SUPABASE_ZMAIL_URL` as plain text = `https://nhdnkzhtadfkkluiulhs.supabase.co/functions/v1/z-mail`
2. Replace in Worker code:
   ```js
   // BEFORE:
   const Z_MAIL    = 'https://nhdnkzhtadfkkluiulhs.supabase.co/functions/v1/z-mail';
   const SUPA_ANON = 'eyJhbG...';
   
   // AFTER (in fetch handler):
   export default {
     async fetch(req, env) {
       const Z_MAIL    = env.SUPABASE_ZMAIL_URL;
       const SUPA_ANON = env.SUPABASE_ANON_KEY;
       // ... rest of handler
     }
   };
   ```

### 4. qron-automation — 🟡 MEDIUM
**Issues (2):**
- Default auth token fallback: `env.AUTH_TOKEN || 'qron-ops-2026'`
- Hardcoded `authichain@gmail.com` in notification sends

**Fix:**
1. Add `AUTH_TOKEN` as Secret in Worker settings (remove the `|| 'qron-ops-2026'` fallback)
2. Add `NOTIFICATION_EMAIL` as plain text variable
3. Replace:
   ```js
   // BEFORE:
   const authToken = env.AUTH_TOKEN || 'qron-ops-2026';
   // ... 
   to: 'authichain@gmail.com',
   
   // AFTER:
   if (!env.AUTH_TOKEN) return Response.json({error:'AUTH_TOKEN not configured'},{status:500});
   const authToken = env.AUTH_TOKEN;
   // ...
   to: env.NOTIFICATION_EMAIL || 'authichain@gmail.com',
   ```

## Remediation Order (do this in sequence)

1. **Rotate Stripe key FIRST** — dashboard.stripe.com → Developers → API keys → Roll secret key
   - This invalidates the exposed key immediately
   - Your Stripe integrations will break until you update them with the new key
   - Update: qron-daily-ops env var, Supabase edge functions, any other integrations

2. **Rotate Resend key** — resend.com → API Keys
   - Create new key, add to resend-relay env var, delete old key

3. **Update all 4 Workers** with env var references (code changes above)

4. **Rotate Groq key** — console.groq.com → API Keys

5. **Verify** — run `wrangler tail <worker-name>` for each to confirm no secrets in logs

## Workers Confirmed Clean (no hardcoded secrets found)

The following Workers were either not audited (lower risk) or confirmed clean:
- qron-outreach: v2 fix already written (docs/qron-outreach-worker-v2.js)
- qron-portfolio, authichain-dashboard, qron-image-gen, qron-stripe-webhook,
  qrontoken-telegram-bot, qron-images, authichain-verify, qron-self-heal,
  authichain-verifier, qron-fiverr, authichain-api, qron-seo-engine,
  square-feather-870cqron-token-monitor, proud-unit-9791qron-api-gateway,
  authichain-automation, strainchain, api-strainchain, strainchain-nft-api

## Post-Remediation Checklist

- [ ] All 4 Stripe/Resend/Groq/Supabase keys rotated
- [ ] All 4 Workers updated to use env vars
- [ ] No secrets visible in `wrangler tail` output
- [ ] Test each Worker's /health endpoint after deploy
- [ ] qron-daily-ops /run still generates correct report
- [ ] resend-relay /emails still sends test email
- [ ] gmail-relay-z /emails still sends via z-mail
- [ ] qron-automation /webhook/lead still captures leads
