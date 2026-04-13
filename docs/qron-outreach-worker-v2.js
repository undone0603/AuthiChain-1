// QRON Outreach Engine v2 — Security-hardened
// All contact data stored in KV, not source code
// All config via env bindings (Workers Settings > Variables)
//
// REQUIRED ENV VARS (set in Cloudflare Dashboard > Workers > qron-outreach > Settings > Variables):
//   OUTREACH_FROM    = "Z | QRON AI QR Art <hello@authichain.com>"
//   OUTREACH_REPLY   = "authichain@gmail.com"
//   RESEND_RELAY_URL = "https://resend-relay.undone-k.workers.dev/emails"
//   AUTH_TOKEN        = (Secret) your auth token — mark as Encrypted
//
// REQUIRED KV NAMESPACE (bind as "KV" in Settings > Variables > KV Namespace Bindings):
//   To populate the queue, POST to /queue/add?key=TOKEN with JSON body:
//   [{ "to": "email", "name": "Name", "subject": "Subject", "body": "Body text" }, ...]
//
// MIGRATION STEPS:
//   1. Add env vars above in Cloudflare Dashboard
//   2. Create KV namespace "qron-outreach-data" and bind as KV
//   3. POST the existing queue to /queue/load?key=TOKEN (one-time migration)
//   4. Deploy this code to replace v1
//   5. Run: wrangler tail qron-outreach  (verify no emails appear in logs)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      const queueSize = await getQueueSize(env);
      return Response.json({ status: 'ok', worker: 'qron-outreach', queue: queueSize });
    }

    // Auth check — token MUST come from env, no fallback
    if (!env.AUTH_TOKEN) {
      return Response.json({ error: 'AUTH_TOKEN not configured' }, { status: 500 });
    }
    const isAuthed = url.searchParams.get('key') === env.AUTH_TOKEN
      || request.headers.get('Authorization') === `Bearer ${env.AUTH_TOKEN}`;

    // --- Public routes above, authenticated routes below ---

    if (url.pathname === '/status') {
      if (!isAuthed) return new Response('Unauthorized', { status: 401 });
      const { queue, sent } = await getState(env);
      return Response.json({
        total: queue.length,
        sent: sent.length,
        remaining: queue.length - sent.length,
        sentEmails: sent.map(s => ({ to: maskEmail(s.to), subject: s.subject, sentAt: s.sentAt })),
        timestamp: new Date().toISOString()
      });
    }

    if (url.pathname === '/send-next') {
      if (!isAuthed) return new Response('Unauthorized', { status: 401 });
      const result = await sendNextBatch(env, 3);
      return Response.json(result);
    }

    if (url.pathname === '/send-all') {
      if (!isAuthed) return new Response('Unauthorized', { status: 401 });
      const result = await sendAll(env);
      return Response.json(result);
    }

    // --- Queue management routes ---

    if (url.pathname === '/queue/load' && request.method === 'POST') {
      if (!isAuthed) return new Response('Unauthorized', { status: 401 });
      try {
        const contacts = await request.json();
        if (!Array.isArray(contacts)) return Response.json({ error: 'Expected JSON array' }, { status: 400 });
        await env.KV.put('outreach_queue', JSON.stringify(contacts), { expirationTtl: 86400 * 90 });
        return Response.json({ loaded: contacts.length });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    }

    if (url.pathname === '/queue/add' && request.method === 'POST') {
      if (!isAuthed) return new Response('Unauthorized', { status: 401 });
      try {
        const newContacts = await request.json();
        const queue = await getQueue(env);
        const merged = [...queue, ...(Array.isArray(newContacts) ? newContacts : [newContacts])];
        await env.KV.put('outreach_queue', JSON.stringify(merged), { expirationTtl: 86400 * 90 });
        return Response.json({ total: merged.length, added: Array.isArray(newContacts) ? newContacts.length : 1 });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    }

    if (url.pathname === '/queue/clear' && request.method === 'POST') {
      if (!isAuthed) return new Response('Unauthorized', { status: 401 });
      await env.KV.delete('outreach_queue');
      await env.KV.delete('outreach_sent');
      return Response.json({ cleared: true });
    }

    const queueSize = await getQueueSize(env);
    return new Response(`QRON Outreach Engine v2
Queue: ${queueSize} emails (stored in KV)
Endpoints:
  /health - Health check
  /status?key=TOKEN - Check send progress
  /send-next?key=TOKEN - Send next 3 emails
  /send-all?key=TOKEN - Send all remaining emails
  POST /queue/load?key=TOKEN - Load queue from JSON array
  POST /queue/add?key=TOKEN - Add contacts to queue
  POST /queue/clear?key=TOKEN - Clear queue and sent list`);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(sendNextBatch(env, 3));
  }
};

// --- Data access (KV-backed) ---

async function getQueue(env) {
  if (!env.KV) return [];
  const data = await env.KV.get('outreach_queue');
  return data ? JSON.parse(data) : [];
}

async function getQueueSize(env) {
  const queue = await getQueue(env);
  return queue.length;
}

async function getSentList(env) {
  if (!env.KV) return [];
  const data = await env.KV.get('outreach_sent');
  return data ? JSON.parse(data) : [];
}

async function saveSentList(env, sent) {
  if (env.KV) {
    await env.KV.put('outreach_sent', JSON.stringify(sent), { expirationTtl: 86400 * 30 });
  }
}

async function getState(env) {
  return { queue: await getQueue(env), sent: await getSentList(env) };
}

// --- Email masking for logs/status ---

function maskEmail(email) {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
}

// --- Send logic ---

async function sendNextBatch(env, count) {
  const queue = await getQueue(env);
  const sent = await getSentList(env);
  const sentEmails = new Set(sent.map(s => s.to));
  const toSend = queue.filter(e => !sentEmails.has(e.to)).slice(0, count);

  const results = [];
  for (const email of toSend) {
    const ok = await sendViaResend(env, email);
    results.push({
      to: maskEmail(email.to),
      subject: email.subject,
      sent: ok,
      timestamp: new Date().toISOString()
    });
    if (ok) {
      sent.push({ to: email.to, subject: email.subject, sentAt: new Date().toISOString() });
    }
  }

  await saveSentList(env, sent);

  // Notify on completion
  if (sent.length >= queue.length && queue.length > 0) {
    await sendViaResend(env, {
      to: env.OUTREACH_REPLY || 'authichain@gmail.com',
      subject: `QRON Outreach Complete - All ${queue.length} Emails Sent`,
      body: `All ${queue.length} outreach emails have been sent.\n\nCheck responses in your inbox.`
    });
  }

  return { batch: results, totalSent: sent.length, totalQueue: queue.length };
}

async function sendAll(env) {
  const queue = await getQueue(env);
  const sent = await getSentList(env);
  const sentEmails = new Set(sent.map(s => s.to));
  const toSend = queue.filter(e => !sentEmails.has(e.to));

  const results = [];
  for (const email of toSend) {
    const ok = await sendViaResend(env, email);
    results.push({ to: maskEmail(email.to), sent: ok });
    if (ok) {
      sent.push({ to: email.to, subject: email.subject, sentAt: new Date().toISOString() });
    }
    await new Promise(r => setTimeout(r, 500));
  }

  await saveSentList(env, sent);
  return { sent: results.filter(r => r.sent).length, failed: results.filter(r => !r.sent).length, results };
}

async function sendViaResend(env, email) {
  const relayUrl = env.RESEND_RELAY_URL || 'https://resend-relay.undone-k.workers.dev/emails';
  const from = env.OUTREACH_FROM || 'Z | QRON AI QR Art <hello@authichain.com>';
  const replyTo = env.OUTREACH_REPLY || 'authichain@gmail.com';

  try {
    const resp = await fetch(relayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email.to,
        subject: email.subject,
        text: email.body,
        from: from,
        reply_to: replyTo
      })
    });
    const result = await resp.json();
    // Log masked email only — never log raw addresses
    console.log(`Email to ${maskEmail(email.to)}: ${result.ok ? 'sent' : 'failed'}`);
    return result.ok || false;
  } catch (e) {
    console.error(`Email error: ${e.message}`);
    return false;
  }
}
