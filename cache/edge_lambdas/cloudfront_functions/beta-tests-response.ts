// Stores the visitor's beta test cookies, as decided by beta-tests-request.
// They are set here, after the cache, so they are never stored with a page.
// It's compiled for cloudfront-js-2.0, and beta-tests-request lists what that
// supports.
/* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "^handler$" }] -- the runtime calls handler */

const HANDOFF_HEADER = 'x-wc-beta-tests';
// The deploy replaces these with the git hash of these sources and the cookie
// domain, which is empty for host-only cookies
const VERSION = '__VERSION__';
const COOKIE_DOMAIN = '__COOKIE_DOMAIN__';
const SIX_MONTHS = 60 * 60 * 24 * 182;

function attributes(maxAge: number): string {
  const parts = ['Path=/', `Max-Age=${maxAge}`, 'Secure', 'SameSite=Lax'];
  if (COOKIE_DOMAIN) parts.push(`Domain=${COOKIE_DOMAIN}`);
  return parts.join('; ');
}

function setCookie(
  response: CloudFrontResponse,
  name: string,
  cookieValue: string
) {
  response.cookies[name] = {
    value: cookieValue,
    attributes: attributes(SIX_MONTHS),
  };
}

function deleteCookie(response: CloudFrontResponse, name: string) {
  response.cookies[name] = { value: '', attributes: attributes(0) };
}

function handler(event: CloudFrontResponseEvent): CloudFrontResponse {
  const response = event.response;
  try {
    const request = event.request;
    response.headers['x-wc-beta-tests-version'] = { value: VERSION };

    const handoff = request.headers[HANDOFF_HEADER];
    if (!handoff) return response;

    if (handoff.value === 'clear') {
      if (request.cookies.wc_ab_bucket) deleteCookie(response, 'wc_ab_bucket');
      if (request.cookies.wc_ab) deleteCookie(response, 'wc_ab');
      return response;
    }

    // set;BUCKET;ENTRIES
    const fields = handoff.value.split(';');
    if (fields.length !== 3 || fields[0] !== 'set') return response;
    setCookie(response, 'wc_ab_bucket', fields[1]);
    if (fields[2]) {
      setCookie(response, 'wc_ab', fields[2]);
    } else if (request.cookies.wc_ab) {
      deleteCookie(response, 'wc_ab');
    }
  } catch {
    // The page is served without changing the visitor's cookies
  }
  return response;
}
