export interface Env {}

type Handler = (req: Request, env: Env) => Promise<Response> | Response;

async function parseJson(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await request.json();
    } catch {
      return null;
    }
  }
  return null;
}

const routes: Record<string, Handler> = {
  '/api/crm/lead': async (req, env) => {
    const body = await parseJson(req);
    return new Response(JSON.stringify({ message: 'CRM lead route placeholder', body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
  '/api/outreach/campaign': async (req, env) => {
    const body = await parseJson(req);
    return new Response(JSON.stringify({ message: 'Outreach campaign route placeholder', body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
  '/api/ip/checklist': async (req, env) => {
    const body = await parseJson(req);
    return new Response(JSON.stringify({ message: 'IP checklist route placeholder', body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
  '/api/networking': async (req, env) => {
    const body = await parseJson(req);
    return new Response(JSON.stringify({ message: 'Networking route placeholder', body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
  '/api/legal/template': async (req, env) => {
    const body = await parseJson(req);
    return new Response(JSON.stringify({ message: 'Legal template route placeholder', body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
  '/api/whitepaper': async (req, env) => {
    const body = await parseJson(req);
    return new Response(JSON.stringify({ message: 'Whitepaper route placeholder', body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
  '/api/business-plan': async (req, env) => {
    const body = await parseJson(req);
    return new Response(JSON.stringify({ message: 'Business plan route placeholder', body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
  '/api/patent/generate': async (req, env) => {
    const body = await parseJson(req);
    return new Response(JSON.stringify({ message: 'Patent generate route placeholder', body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
  '/api/social/schedule': async (req, env) => {
    const body = await parseJson(req);
    return new Response(JSON.stringify({ message: 'Social schedule route placeholder', body }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const handler = routes[path];
  if (handler) {
    return handler(request, env);
  }
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
};
