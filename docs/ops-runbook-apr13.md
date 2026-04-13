# Operations Runbook — April 13, 2026

## Item 3: Remove Hardcoded Emails from qron-outreach Worker
**Status: CODE READY — needs manual deploy**
**Priority: CRITICAL (security)**

### What was found
The v1 Worker has 9 hardcoded personal email addresses, full email bodies, a default auth token (`qron-ops-2026`), and `authichain@gmail.com` visible in source code. Anyone hitting the root URL sees the Worker name; anyone who can access the Cloudflare dashboard or API can read all contact data.

### Files created
- `docs/qron-outreach-worker-v2.js` — Rewritten Worker: all contacts in KV, config in env vars, emails masked in logs
- `docs/qron-outreach-queue-migration.json` — Extracted contact queue ready to load into KV

### Deploy steps (Cloudflare Dashboard)
1. Go to **Workers & Pages → qron-outreach → Settings → Variables and Secrets**
2. Add variables:
   - `OUTREACH_FROM` = `Z | QRON AI QR Art <hello@authichain.com>`
   - `OUTREACH_REPLY` = `authichain@gmail.com`
   - `RESEND_RELAY_URL` = `https://resend-relay.undone-k.workers.dev/emails`
   - `AUTH_TOKEN` = (your token) — **mark as Secret/Encrypted**
3. Ensure KV namespace `qron-outreach-data` is bound as `KV`
4. Replace Worker code with contents of `docs/qron-outreach-worker-v2.js`
5. Deploy, then load the queue:
   ```bash
   curl -X POST "https://qron-outreach.undone-k.workers.dev/queue/load?key=YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d @docs/qron-outreach-queue-migration.json
   ```
6. Verify: `wrangler tail qron-outreach` — confirm no raw emails in logs

---

## Item 4: Submit authichain.com to Google Search Console
**Status: MANUAL — browser required**
**Priority: HIGH (SEO)**

1. Go to https://search.google.com/search-console
2. Add property → **Domain** type → `authichain.com`
3. Google provides a TXT record → add in Cloudflare DNS (propagation instant)
4. Click Verify
5. Sitemaps → submit `authichain.com/sitemap.xml` (25 URLs, verified live)
6. URL Inspection → request indexing for `/`, `/dashboard`, `/pricing`, `/docs`
7. Repeat for `qron.space` (41 URLs in sitemap)

---

## Item 5: Swap Make.com Scenarios
**Status: MANUAL — Make.com dashboard required**
**Priority: MEDIUM (ops quota optimization)**

### Current state (Free plan: 2 active max, 1000 ops/month)
| ID | Scenario | Active | Executions | Ops |
|----|----------|--------|------------|-----|
| 4561168 | Lead Capture to CRM Sync | ✅ | 140 | 148 |
| 4461924 | New Customer Welcome Email | ✅ | 0 | 0 |
| 4591736 | Daily Revenue Monitor | ❌ | 0 | 0 |
| 4561790 | Demo Booking - Calendar + CRM | ❌ | 0 | 0 |
| 4561171 | Nurture Engine - Email Sequences | ❌ (invalid) | 9 | 12 |
| 4591728 | Reality Enforcer - Pipeline Guard | ❌ | 0 | 0 |
| 4350577 | Retail Verification Flow | ❌ | 0 | 0 |
| 4711581 | Sales Outreach Agent | ❌ | 0 | 0 |

### Action
1. **Deactivate** "New Customer Welcome Email" (4461924) — 0 executions, dead weight
2. **Activate** "Retail Verification Flow" (4350577) — run manual test first
3. Check Dashboard → Usage to confirm ops shift
4. Consider: Retail Verification is webhook-only (`type: immediately`) — add scheduling trigger if it needs to poll

### Note
Make.com MCP has read-only auth — can list/inspect but not toggle. Must use dashboard.

---

## Item 6: Apply for NSF SBIR Distributed Ledger ($275K)
**Status: RESEARCH IN PROGRESS**
**Priority: HIGH (non-dilutive funding)**

### Key facts
- Phase I = $275K / 6 months, non-dilutive
- Two-step process: Project Pitch first → full proposal only if invited
- Topics DL8 (Supply Chain Integrity) and DL14 (Trusted Identity) fit AuthiChain
- SAM.gov registration required (7-10 business days) — start immediately
- Project Pitch = 5 slides: problem, solution, market, team, why now

### Immediate actions
1. Start SAM.gov entity registration today (free, but slow)
2. Check seedfund.nsf.gov for current solicitation window
3. Draft 5-slide Project Pitch from existing AuthiChain materials:
   - Problem: counterfeit goods, provenance gaps, cannabis compliance burden
   - Solution: blockchain-backed authentication + DPP registry
   - Market: $4.2T counterfeit market, EU DPP mandate July 2026
   - Team: solo founder + AI-augmented ops
   - Why now: EU ESPR, state cannabis track-and-trace mandates

---

## Item 7: EU DPP Positioning (July 2026 Window)
**Status: DOMAIN CHECK INCONCLUSIVE — Vercel registrar doesn't support .eu**
**Priority: MEDIUM (strategic positioning)**

### Actions
1. **Register authichain.eu** via Cloudflare Registrar (requires EU address of record)
   - Vercel domain checker returned empty for .eu — use Cloudflare Registrar directly
   - May need registered agent or EU business address for .eu eligibility
2. **Schema mapping**: Align provenance data model to ESPR DPP attributes:
   - Product ID/GTIN, material composition, manufacturer info
   - Lifecycle/repair data, carbon footprint fields
3. **LinkedIn outreach**: Target EU sustainability/compliance leads
   - Hook: "DPP-ready blockchain registry — operational before July 2026 mandate"
4. **One-pager CTA**: Frame as "white-label DPP registry as a service"
5. **Product Hunt launch angle**: "First blockchain-backed DPP registry ahead of EU July 2026 mandate"
