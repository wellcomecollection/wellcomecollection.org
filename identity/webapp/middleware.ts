import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { redactUrl } from '@weco/identity/utils/logging';

export function middleware(request: NextRequest) {
  const { method } = request;
  const url = redactUrl(request.nextUrl.pathname + request.nextUrl.search);

  console.log(`<-- ${method} ${url}`);

  // Note: Next.js middleware can’t observe the full response lifecycle,
  // so it can’t reliably log end-to-end request duration/status here.
  return NextResponse.next();
}

export const config = {
  // Match all paths except static files and Next.js internals
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
