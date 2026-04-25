import { NextRequest, NextResponse } from 'next/server'

const NOTION_S3_HOST = 'prod-files-secure.s3.us-west-2.amazonaws.com'

// Always dynamic — never cache at the route level; cache headers are set on the response
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get('src')
  if (!src) return new NextResponse('Missing src', { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(src)
  } catch {
    return new NextResponse('Invalid URL', { status: 400 })
  }

  if (parsed.hostname !== NOTION_S3_HOST) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const upstream = await fetch(src, { cache: 'no-store' })
  if (!upstream.ok) {
    return new NextResponse('Upstream error', { status: upstream.status })
  }

  const contentType = upstream.headers.get('content-type') ?? 'image/jpeg'
  const body = await upstream.arrayBuffer()

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType,
      // Cache for 55 min (Notion S3 URLs expire at ~60 min, ISR reruns every 5 min)
      'Cache-Control': 'public, max-age=3300, s-maxage=3300, stale-while-revalidate=60',
    },
  })
}
