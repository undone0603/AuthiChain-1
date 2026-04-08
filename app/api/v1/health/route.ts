import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 60;

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "AuthiChain API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      verify: "/api/v1/verify/:cert_id",
      register: "/api/v1/register",
      health: "/api/v1/health",
    },
    blockchain: "Polygon Mainnet",
    contract: "0x5db511706FB6317cd23A7655F67450c5AC6e6AA2",
    platforms: ["AuthiChain", "QRON", "StrainChain"],
    docs: "https://authichain.com/openapi.json",
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=60",
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  });
}
