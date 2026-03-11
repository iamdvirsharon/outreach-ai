import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getBaseUrl } from "@/lib/url"

// Vercel Cron Jobs hit this endpoint on schedule
// Configured in vercel.json

export async function GET(req: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Create scrape jobs for all active companies
  const companies = await prisma.monitoredCompany.findMany({
    where: { isActive: true },
  })

  if (companies.length === 0) {
    return NextResponse.json({ message: "No active companies" })
  }

  const jobs = []
  for (const company of companies) {
    // Dedup: skip if company already has a queued or running job
    const existingJob = await prisma.scrapeJob.findFirst({
      where: {
        companyId: company.id,
        status: { in: ["queued", "running"] },
      },
    })
    if (existingJob) continue

    const job = await prisma.scrapeJob.create({
      data: { companyId: company.id },
    })
    jobs.push({ jobId: job.id, companyName: company.name })
  }

  // Kick off the worker
  fetch(`${getBaseUrl()}/api/scrape/worker`, {
    method: "POST",
    headers: { "x-internal-key": process.env.INTERNAL_API_KEY || "" },
  }).catch(() => {})

  return NextResponse.json({
    message: `Triggered ${jobs.length} scrape jobs`,
    jobs,
  })
}
