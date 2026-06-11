import { NextRequest } from 'next/server';

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

// The auth0 middleware mounts the auth routes (login, logout, callback - see
// the routes config in utils/auth0.ts) and rolls the session cookie expiry
// on every matched request.
export async function middleware(request: NextRequest) {
  // v3 resolved relative logout returnTo values (eg ?returnTo=/success)
  // against the app's base URL, but v4 forwards them verbatim to Auth0,
  // which only accepts the absolute URLs in its allowed logout URLs list
  if (isLogoutPath(request) && request.nextUrl.searchParams.has('returnTo')) {
    const returnTo = request.nextUrl.searchParams.get('returnTo') as string;
    if (isRelative(returnTo)) {
      const url = request.nextUrl.clone();
      url.searchParams.set(
        'returnTo',
        siteBaseUrl + identityBasePath + returnTo
      );
      return auth0.middleware(new NextRequest(url, request));
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
