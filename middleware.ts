import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Match /google{token}.html — return exact filename as GSC expects
  const m = pathname.match(/^\/google([a-zA-Z0-9_-]+)\.html$/)
  if (m) {
    const filename = `google${m[1]}.html`
    return new NextResponse(`google-site-verification: ${filename}`, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/google:token*.html']
}
