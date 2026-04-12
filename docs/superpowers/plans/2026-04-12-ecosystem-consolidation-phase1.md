# Ecosystem Consolidation Phase 1 — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Content Registry, activate n8n automation, and enforce the "check before building" convention across all repos.

**Architecture:** Notion Content Registry is the single source of truth. n8n syncs Stripe/GitHub events. CLAUDE.md in every repo enforces registry-first workflow. No code changes — operational actions only.

**Tech Stack:** Notion MCP, n8n MCP (HTTP), HubSpot MCP, Airtable MCP, Google Drive MCP, Cloudflare MCP, local file system.

---

## Chunk 1: Finish Content Registry Population

### Task 1: Add remaining Downloads artifacts to registry

**Files:**
- Read: `C:\Users\rac\Downloads\agentZ-v3-marketing.md`
- Read: `C:\Users\rac\Downloads\agentZ-v4-developer-api.md`
- Read: `C:\Users\rac\Downloads\agentZ-v5-investor.md`
- Read: `C:\Users\rac\Downloads\authichain-openapi.json`
- Read: `C:\Users\rac\Downloads\authichain-rapidapi-listing.json`
- Read: `C:\Users\rac\Downloads\qron-ops-stack-reference-2026-03-31.md`
- Read: `C:\Users\rac\Downloads\IMPLEMENT_IN_AUTHICHAIN_UNIFIED.md`
- Target: Notion Content Registry (data source `collection://444d6e99-eb2a-4460-95d4-a4dc6f3bf518`)

- [ ] **Step 1: Create Notion pages for Downloads artifacts**

Use `notion-create-pages` with parent `data_source_id: 444d6e99-eb2a-4460-95d4-a4dc6f3bf518`. Create entries for:

| Asset Name | Source | Type | Status | Project | Priority |
|-----------|--------|------|--------|---------|----------|
| AgentZ Marketing One-Pager (v3) | Downloads | Marketing | Draft | AgentZ | Medium |
| AgentZ Developer API Doc (v4) | Downloads | Document | Draft | AgentZ | Medium |
| AgentZ Investor Doc (v5) | Downloads | Document | Draft | AgentZ | Medium |
| AuthiChain OpenAPI Spec | Downloads | API/Endpoint | Live | AuthiChain | High |
| AuthiChain RapidAPI Listing | Downloads | Config | Live | AuthiChain | High |
| QRON Ops Stack Reference (Mar 31) | Downloads | Document | Stale | QRON | Medium |
| AuthiChain Unified Integration Notes | Downloads | Document | Live | All | Medium |

- [ ] **Step 2: Verify entries appear in Notion**

Run: `notion-search` query "AgentZ" — expect 3+ results.

### Task 2: Add Google Drive video assets to registry

- [ ] **Step 1: Create Notion pages for Drive videos**

| Asset Name | Source | Type | Status | Project | Priority |
|-----------|--------|------|--------|---------|----------|
| Founder Video (MP4) | Google Drive | Media | Live | All | High |
| QRON Main Overview Video | Google Drive | Media | Live | QRON | Medium |
| QRON Vision & How It Works Video | Google Drive | Media | Live | QRON | Medium |
| Premium Cannabis AI Storytelling Video | Google Drive | Media | Live | StrainChain | Medium |
| Food & Beverage Origin Validation Video | Google Drive | Media | Live | AuthiChain | Medium |
| American Eagle Seal Experience Video | Google Drive | Media | Live | AuthiChain | Medium |

### Task 3: Add remaining OneDrive automation docs to registry

- [ ] **Step 1: Create Notion pages for OneDrive docs not yet cataloged**

| Asset Name | Source | Type | Status | Project | Priority |
|-----------|--------|------|--------|---------|----------|
| Master Implementation Plan | OneDrive | Document | Unknown | All | High |
| Complete Revenue Machine | OneDrive | Document | Unknown | All | High |
| Automated Sales SOC | OneDrive | Document | Unknown | All | Medium |
| Browser Automation Tasks (AgentZ) | OneDrive | Document | Draft | AgentZ | Medium |
| Mailchimp Email Templates | OneDrive | Template | Stale | All | Low |
| Mailchimp Integration Guide | OneDrive | Document | Stale | All | Low |
| Zapier Free Plan Config | OneDrive | Document | Superseded | All | Low |
| Webhook Test Instructions | OneDrive | Document | Unknown | All | Low |

- [ ] **Step 2: Verify total registry count**

Run: `notion-search` query "Content Registry" — verify 50+ assets total.

---

## Chunk 2: Add CLAUDE.md Enforcement Directive

### Task 4: Update CLAUDE.md in AuthiChain repo

**Files:**
- Modify: `C:\Users\rac\OneDrive\Desktop\AuthiChain\CLAUDE.md`

- [ ] **Step 1: Add registry-check directive to CLAUDE.md**

Append to the end of the existing CLAUDE.md:

```markdown
## Content Registry (Notion)

Before creating new files, check the Notion Content Registry to avoid duplication:
https://www.notion.so/3959bfd5dd9e4b9cb741ef7c2ea7cd78

If a similar asset exists, update it instead of creating a new one. If creating new, register it in the Content Registry immediately with Source, Type, Status, Project, and Priority.
```

- [ ] **Step 2: Commit the change**

```bash
cd /c/Users/rac/OneDrive/Desktop/AuthiChain
git add CLAUDE.md
git commit -m "chore: add Content Registry check directive to CLAUDE.md"
```

### Task 5: Update CLAUDE.md in authichain-unified repo

**Files:**
- Modify: `C:\Users\rac\authichain-unified\CLAUDE.md`

- [ ] **Step 1: Add same registry-check directive**

Append the same Content Registry section as Task 4.

- [ ] **Step 2: Commit the change**

```bash
cd /c/Users/rac/authichain-unified
git add CLAUDE.md
git commit -m "chore: add Content Registry check directive to CLAUDE.md"
```

### Task 6: Update CLAUDE.md in qron-app repo

**Files:**
- Modify: `C:\Users\rac\OneDrive\Desktop\qron-app\CLAUDE.md`

- [ ] **Step 1: Read existing CLAUDE.md, add registry directive**

- [ ] **Step 2: Commit and push**

```bash
cd /c/Users/rac/OneDrive/Desktop/qron-app
git add CLAUDE.md
git commit -m "chore: add Content Registry check directive to CLAUDE.md"
git push origin main
```

---

## Chunk 3: Activate n8n Workflow

### Task 7: Document n8n activation steps (manual)

The n8n workflow cannot be activated programmatically because 5 SMTP nodes need credentials configured in the n8n UI. This task documents the exact steps for the user.

- [ ] **Step 1: Create a Notion page with n8n activation instructions**

Create under Mission Control with content:

```
## n8n Activation Checklist

Workflow: AuthiChain Automation Core (0L4KYBahs2xYDAVq)
URL: https://authichain.app.n8n.cloud

### Steps:
1. Open https://authichain.app.n8n.cloud
2. Open workflow "AuthiChain Automation Core"
3. For each of these 5 nodes, add SMTP credentials:
   - Email Invoice Paid
   - Email Subscription Created
   - Email Subscription Updated
   - Email Subscription Deleted
   - Email Churn Alert
4. Credential config: Use Resend SMTP
   - Host: smtp.resend.com
   - Port: 465
   - User: resend
   - Password: re_6dbb21V5_HNr6VZKosuuWG8X7ks9Ir (from memory)
   - SSL: Yes
5. Configure "Query Low Usage Customers" node:
   - Connect to Supabase (nhdnkzhtadfkkluiulhs)
   - Query: SELECT * FROM subscriptions WHERE status = 'active' AND usage < threshold
6. Click "Activate" toggle
7. Test with a manual trigger via /run endpoint
```

- [ ] **Step 2: Create HubSpot task for n8n activation**

```
Subject: Activate n8n AuthiChain Automation Core workflow
Body: Follow instructions in Notion. Needs SMTP (Resend) credentials for 5 email nodes + Supabase query config.
Due: 2026-04-13
Priority: HIGH
```

### Task 8: Update Content Registry — mark n8n status

- [ ] **Step 1: Update the n8n registry entry status from "Draft" to "Planned"**

Note: changes to "Live" once user completes manual activation.

---

## Chunk 4: Final Verification

### Task 9: Verify all success criteria

- [ ] **Step 1: Count Content Registry assets**

Query Notion for total entries. Target: 50+ assets.

- [ ] **Step 2: Verify CLAUDE.md directives exist in all 3 repos**

```bash
grep -l "Content Registry" /c/Users/rac/OneDrive/Desktop/AuthiChain/CLAUDE.md /c/Users/rac/authichain-unified/CLAUDE.md /c/Users/rac/OneDrive/Desktop/qron-app/CLAUDE.md
```

Expected: all 3 files returned.

- [ ] **Step 3: Verify HubSpot tasks exist**

Search HubSpot tasks — expect 8+ tasks (7 from earlier + 1 n8n activation).

- [ ] **Step 4: Verify n8n activation instructions are in Notion**

Search Notion for "n8n Activation Checklist" — expect 1 result.

- [ ] **Step 5: Log completion to Notion Session Codex**

Create a session log entry under Session Codex with summary of everything accomplished this session.
