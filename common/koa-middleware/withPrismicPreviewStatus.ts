import Koa from 'koa';

export function withPrismicPreviewStatus(
  ctx: Koa.DefaultContext,
  next: Koa.Next
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<any> {
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // for previews on localhost we use /preview to determine whether the 'isPreview' cookie should be set
  // this kinda works for live too, but not for shared preview links, as they never hit /preview
  // we therefore look for the subdomain .preview to determine if it's a preview
  const previewCookieName = 'isPreview';
  const isPreviewDomain = Boolean(ctx.request.host.startsWith('preview.'));
  const previewCookieMatch = ctx.headers.cookie
    ? ctx.headers.cookie.match(`(^|;) ?${previewCookieName}=([^;]*)(;|$)`)
    : undefined;

  const previewCookie = previewCookieMatch ? previewCookieMatch[2] : undefined;

  if (isPreviewDomain && !previewCookie) {
    ctx.cookies.set('isPreview', 'true', {
      httpOnly: false,
    });
  }
  return next();
}
