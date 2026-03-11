import { NextResponse } from "next/server"

const PROVIDERS = [
  {
    id: "apollo",
    name: "Apollo.io",
    check: () => !!process.env.APOLLO_API_KEY,
  },
  {
    id: "zoominfo",
    name: "ZoomInfo",
    check: () => !!process.env.ZOOMINFO_CLIENT_ID && !!process.env.ZOOMINFO_PRIVATE_KEY,
  },
  {
    id: "leadiq",
    name: "LeadIQ",
    check: () => !!process.env.LEADIQ_API_KEY,
  },
]

export async function GET() {
  const providers = PROVIDERS.map((p) => ({
    id: p.id,
    name: p.name,
    configured: p.check(),
  }))

  return NextResponse.json({ providers })
}
