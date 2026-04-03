import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const m = pathname.match(/^\/google([a-zA-Z0-9_-]+)\.html$/)
  if (m) {
    return new NextResponse(`google-site-verification: ${m[1]}`, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/google:token*.html']
}
