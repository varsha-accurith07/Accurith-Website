// GET /api/careers/openings — list of open roles.
//
// Contract:
//   GET /api/careers/openings
//   Response 200: { openings: [ { id, slug, title, department, location,
//                                  employmentType, descriptionMd, postedAt } ] }
//
// Only returns rows where isOpen = true. Varsha's static-export frontend
// fetches this from the browser, so CORS is required.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { corsHeaders, handlePreflight } from '@/lib/cors';

// Cache: 60 s public, 5 min stale-while-revalidate at the CDN. Openings
// change infrequently and we do not want a burst of career-page hits
// hitting Postgres every time.
const CACHE = 'public, max-age=60, stale-while-revalidate=300';

export function OPTIONS(req: Request): Response {
  return handlePreflight(req);
}

export async function GET(req: Request): Promise<Response> {
  try {
    const openings = await prisma.jobOpening.findMany({
      where: { isOpen: true },
      orderBy: { postedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        department: true,
        location: true,
        employmentType: true,
        descriptionMd: true,
        postedAt: true,
      },
    });
    return NextResponse.json(
      { openings },
      { headers: { 'Cache-Control': CACHE, ...corsHeaders(req) } },
    );
  } catch (err) {
    console.error('openings: db read failed', err);
    // Empty list rather than 500 — the careers page can still render its
    // "no openings right now" copy instead of a broken state.
    return NextResponse.json({ openings: [] }, { status: 200, headers: corsHeaders(req) });
  }
}
