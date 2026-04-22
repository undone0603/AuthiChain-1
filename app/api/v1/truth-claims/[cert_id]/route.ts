import { NextRequest, NextResponse } from 'next/server';

const TRUTH_WORKER = 'https://qron-truth-network.undone-k.workers.dev';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ cert_id: string }> }
) {
  try {
    const { cert_id } = await params;
    const r = await fetch(`${TRUTH_WORKER}/api/v1/truth-claims/${cert_id}`);
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: 'upstream error' }, { status: 503 });
  }
}

export const runtime = 'edge';
