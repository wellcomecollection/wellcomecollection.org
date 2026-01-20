import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { redactUrl } from '@weco/identity/utils/logging';

export function middleware(request: NextRequest) {
  const start = Date.now();
  const { method } = request;
  const url = redactUrl(request.nextUrl.pathname + request.nextUrl.search);

  console.log(`<-- ${method} ${url}`);

  const response = NextResponse.next();

  // Log after response (using a promise that doesn't block)
  // Note: In production with real traffic, consider using a proper logging service
  // This will log asynchronously and won't have access to actual response status
  Promise.resolve().then(() => {
    const ms = Date.now() - start;
    // We don't have access to actual response status/length in middleware
    // but we log what we can
    console.log(`--> ${method} ${url} ${ms}ms`);
  });

  return response;
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
