import { NextRequest, NextResponse } from 'next/server';

import auth0, {
  identityBasePath,
  siteBaseUrl,
} from '@weco/identity/utils/auth0';

const isLogoutPath = (request: NextRequest): boolean => {
  // Next.js doesn't strip the basePath from pathname in middleware
  const { pathname, basePath } = request.nextUrl;
  const path =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length)
      : pathname;
  return path === '/api/auth/logout';
};

const isRelative = (returnTo: string): boolean => {
  try {
    new URL(returnTo);
    return false;
  } catch {
    return true;
  }
};

// In production there is one public origin, configured via SITE_BASE_URL. In
// local development the app is reached from several origins (localhost, the
// www-dev.wellcomecollection.org nginx proxy), so derive the origin from the
// request, as the SDK itself does while appBaseUrl is unset (see the
// appBaseUrl config in utils/auth0.ts).
const requestOrigin = (request: NextRequest): string => {
  if (process.env.NODE_ENV !== 'development') {
    return siteBaseUrl;
  }
  const proto =
    request.headers.get('x-forwarded-proto')?.split(',')[0].trim() ||
    request.nextUrl.protocol.replace(':', '');
  const host =
    request.headers.get('x-forwarded-host')?.split(',')[0].trim() ||
    request.headers.get('host') ||
    request.nextUrl.host;
  return `${proto}://${host}`;
};

// The auth0 middleware mounts the auth routes (login, logout, callback - see
// the routes config in utils/auth0.ts) and rolls the session cookie expiry
// on every matched request.
export async function middleware(request: NextRequest) {
  // v3 resolved relative logout returnTo values (eg ?returnTo=/success)
  // against the app's base URL, but v4 forwards them verbatim to Auth0,
  // which only accepts the absolute URLs in its allowed logout URLs list.
  //
  // Absolutise by redirecting back to this same route: the SDK's own route
  // matching relies on request internals (nextUrl.basePath) that don't
  // survive constructing a modified copy of the request here.
  if (isLogoutPath(request) && request.nextUrl.searchParams.has('returnTo')) {
    const returnTo = request.nextUrl.searchParams.get('returnTo') as string;
    if (isRelative(returnTo)) {
      const url = request.nextUrl.clone();
      url.searchParams.set(
        'returnTo',
        requestOrigin(request) + identityBasePath + returnTo
      );
      return NextResponse.redirect(url);
    }
  }

  return auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
