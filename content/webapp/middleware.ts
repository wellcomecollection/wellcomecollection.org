import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set preview cookie based on subdomain
  // for previews on localhost we use /preview to determine whether the 'isPreview' cookie should be set
  // this kinda works for live too, but not for shared preview links, as they never hit /preview
  // we therefore look for the subdomain .preview to determine if it's a preview
  const previewCookieName = 'isPreview';
  const isPreviewDomain =
    request.headers.get('host')?.startsWith('preview.') || false;
  const previewCookie = request.cookies.get(previewCookieName);

  if (isPreviewDomain && !previewCookie) {
    response.cookies.set('isPreview', 'true', {
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  // Match all paths
  matcher: '/:path*',
};
