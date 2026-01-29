import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Preview Cookie Management
 *
 * This middleware runs on every request before the page is rendered. It handles
 * automatic preview cookie setting for Prismic preview functionality.
 *
 * ## Purpose:
 * Prismic previews can be accessed via:
 * 1. The /preview API endpoint (see pages/api/preview.ts) - works locally
 * 2. Shared preview links with preview.* subdomain - requires this middleware
 *
 * ## How it works:
 * - Checks if the request is to a preview.* subdomain (e.g., preview.wellcomecollection.org)
 * - If yes, and the 'isPreview' cookie is not already set, it sets the cookie
 * - The cookie is set with httpOnly: false so it's accessible to client-side JavaScript
 *
 * ## Why httpOnly: false?
 * The preview cookie needs to be read by Prismic's client-side preview scripts
 * to enable live preview editing functionality in the Prismic dashboard.
 *
 * ## Related files:
 * - pages/api/preview.ts - Prismic preview API endpoint that redirects to preview content
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set preview cookie based on subdomain
  // For previews on localhost we use /preview to determine whether the 'isPreview' cookie should be set
  // This kinda works for live too, but not for shared preview links, as they never hit /preview
  // We therefore look for the subdomain .preview to determine if it's a preview
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
