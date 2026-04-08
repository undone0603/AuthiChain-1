import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, company, vertical, source } = body;
    
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400, headers: CORS });
    }

    const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supaUrl || !supaKey) {
      return NextResponse.json({ ok: true, message: "Waitlist signup received" }, { headers: CORS });
    }

    const r = await fetch(`${supaUrl}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        "apikey": supaKey,
        "Authorization": `Bearer ${supaKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({ email, name, company, vertical, source: source || "api" }),
    });

    if (!r.ok && r.status !== 409) {
      throw new Error(`Supabase error: ${r.status}`);
    }

    return NextResponse.json({
      ok: true,
      message: r.status === 409 ? "Already on waitlist" : "Added to waitlist",
    }, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ ok: true, message: "Waitlist signup received" }, { headers: CORS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }});
}
