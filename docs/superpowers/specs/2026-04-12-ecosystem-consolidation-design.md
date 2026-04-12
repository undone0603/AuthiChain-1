# Authentic Economy — Autonomous Operations Consolidation

**Date:** 2026-04-12
**Status:** Approved
**Author:** Claude Opus 4.6 + Z Kietzman

## Problem

Content and configuration is scattered across 16 platforms (Notion, Airtable, Google Drive, OneDrive, 3 GitHub repos, Cloudflare, Supabase, Stripe, n8n, Downloads, Desktop, Claude Memory, Codex, ChatGPT/Perplexity/Copilot/Grok/Comet/ClickUp). This causes:

1. Duplication — same Stripe price IDs exist in 3+ places with different values
2. Stale plans — 90-day GTM plan from Dec 2025 has specs for features built differently
3. Orphaned content — AI-generated docs across 6+ tools never triaged or integrated
4. Wasted outreach — 332 emails sent to fabricated leads (0% reply rate) while real drip system gets 60% MSO reply rate

## Architecture

### Hub: Notion

Notion is the single pane of glass. It contains:

- **Mission Control** — platform status, infrastructure IDs, revenue pipeline, milestones
- **Content Registry** (new) — 30+ assets cataloged with Source, Type, Status, Project, Priority, Last Verified, Location/URL
- **Protocol Docs** — autonomous ops architecture, intelligence briefs
- **Session Codex** — all sprint logs by date
- **Master Credentials Vault** — all secrets and account IDs

### Sync Engine: n8n

"AuthiChain Automation Core" workflow (ID: `0L4KYBahs2xYDAVq`):

- Stripe trigger → invoice/subscription lifecycle → Supabase + notifications + email
- GitHub trigger → deployment events → logging
- Schedule trigger �� churn risk detection
- Webhook → normalized event processing

**Status:** Inactive. Needs SMTP credentials (Resend) and Supabase query config.

### Edge Execution: Cloudflare Workers

Active workers (keep):
- `authichain-autopilot` — drip outreach, 47 prospects, 3 MSO replies, 15/day limit
- `qron-daily-ops` — ops monitoring, Groq AI insights, email digest
- `qron-image-gen` — HuggingFace FLUX.1 QR art generation
- `authichain-api` — RapidAPI gateway, real Supabase data
- `authichain-automation` — D1 CRM (needs v2.0.2 deploy for /analytics fix)

Dead/retired:
- `qron-storefront` — route deleted, Vercel serving qron.space
- 50+ template/dead workers — audit in Phase 2

### CRM: HubSpot (Free Tier Maximized)

- 175 deals, 175 contacts, 101 companies
- 7 tasks with due dates and contact associations
- 6 products mirroring Stripe catalog
- 3 realistic deals for MSO replies ($2,388/yr each, Qualified to Buy)
- Notes logged on all replied contacts

### Retired/Consolidated Platforms

- **Airtable** — 2 bases exist (Operations `app4lw5wNMNmzTNMn`, Marketing `appERlrcb1RcoPdA7`). Status: Unknown. Being superseded by Supabase for data and Notion for project management. Audit in Phase 2 to determine if any unique data exists.
- **Make.com** — Scenario JSONs exist on OneDrive. Superseded by n8n Automation Core as the canonical automation platform. Do not import Make.com scenarios.
- **Vercel** — Hosts authichain.com and qron.space. Team: `team_PKVRDwUXPRFjmGTM7PZxjNys`. Deployment via GitHub push. Not a content source, just infrastructure.

## Data Flow

```
New sale       → Stripe webhook → n8n → Supabase + HubSpot + Email  (Phase 1 — n8n currently inactive)
New deploy     → GitHub webhook → n8n → Notion session log           (Phase 1 — n8n currently inactive)
Daily ops      → qron-daily-ops Worker → email digest                (LIVE)
Drip outreach  → authichain-autopilot Worker → Resend → Supabase    (LIVE)
Content change → Claude session → Notion Content Registry update     (LIVE — convention)
HubSpot tasks  → Manual creation via Claude/MCP or HubSpot UI       (LIVE)
```

## What Was Completed (This Session)

### Infrastructure
- Integrated 10 Claude artifact files into AuthiChain codebase (PR #77, merged)
- Fixed 13 pre-existing TS/build errors — 0 errors, 98 pages
- Unblocked qron.space — deleted Worker route, Vercel serving
- Created `qron_registrations` D1 table + 3 indexes
- Fixed guest generation base64 bloat (PR qron-app#39)
- Deployed authichain-automation worker with fix (PR #78)
- Created CLAUDE.md for both codebases
- Added `@fal-ai/client` dependency

### Revenue Pipeline
- Diagnosed fabricated outreach (332 emails, 0% delivery, 0 replies)
- Paused 207 fabricated leads
- Cleaned 6 bounced emails from drip system
- Loaded 3 verified dispensary prospects into autopilot
- Resend audit: confirmed 20% delivery rate, 24 stuck in delivery_delayed

### Intelligence Applied
- Competitive intel (Verisart, Arianee, Chronicled, SICPA, Lucid Green)
- EU DPP deadlines (registry July 2026, batteries Feb 2027)
- Cold email benchmarks (timeline hooks 2.3x better)
- METRC pain points for cannabis sales angle
- 4 grant opportunities loaded into Supabase (YC S26, Polygon x2, NSF SBIR)
- 14-email onboarding sequence from Google Drive
- Stripe price IDs from qron-config.json

### Consolidation
- Notion Content Registry created with 30 assets across 9 sources
- n8n MCP connected (16 tools, 2 workflows mapped)
- HubSpot maximized (7 tasks, 6 products, 3 deals, 3 notes, 4 contacts)
- Grok API key saved to memory
- OneDrive docs cataloged (30+ files referenced in memory)

## Remaining Work

### Phase 1: Complete Consolidation (This Plan)
- Finish populating Content Registry (AgentZ docs, videos, remaining OneDrive guides)
- Activate n8n workflow (add SMTP credentials in n8n UI)
- Deploy authichain-automation v2.0.2 (wrangler deploy from undone-k account)

### Phase 2: AI Export Triage (Next Session)
- Export conversations from ChatGPT, Perplexity, Copilot, Grok, Comet, ClickUp
- Dump into `C:\Users\rac\OneDrive\Desktop\ai-exports\`
- Process and triage into Content Registry
- Flag duplicates across all sources

### Phase 3: Operating Convention (Ongoing)
- Every session checks Content Registry before building
- New assets get registered immediately
- Stale/duplicate items get flagged in real-time
- HubSpot tasks drive daily execution

## Success Criteria

1. Every asset across all 16 platforms is in the Notion Content Registry
2. Duplicates flagged with "Duplicate" or "Superseded" status
3. n8n Automation Core is active
4. HubSpot tasks drive daily action
5. No new feature gets built without checking registry first

## Known Risks

1. **Resend deliverability** — 20% delivery rate confirmed. 24 emails stuck in delivery_delayed. Must resolve before n8n activation or notifications won't arrive. Check Resend dashboard for domain reputation.
2. **Single-machine dependency** — Local paths (`C:\Users\rac\...`) used throughout. Notion Master Credentials Vault is the disaster recovery anchor. GitHub repos and Supabase serve as backup sources of truth if Notion is unavailable.
3. **Free-tier limits** — HubSpot (1000 contacts free), n8n cloud (execution limits), Supabase (500MB DB, 2GB bandwidth), Cloudflare Workers (100K requests/day free). Monitor usage.
4. **Phase 3 enforcement** — "Check registry before building" is a convention. Enforced via CLAUDE.md directive in all repos: "Check Notion Content Registry before creating new files."

## Exclusions

- No new features, pages, or UI work
- No CodePen 2.0 editor patterns (deferred)
- No blockchain contract deployments
- No new Workers or API endpoints
- No codebase refactoring
