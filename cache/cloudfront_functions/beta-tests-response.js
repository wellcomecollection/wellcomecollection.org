// Stores the visitor's beta test cookies, as decided by beta-tests-request.js.
// They are set here, after the cache, so they are never stored with a page.
// Runtime: cloudfront-js-2.0.

/* eslint no-unused-vars: ["error", { "caughtErrors": "none", "varsIgnorePattern": "^handler$" }] -- the runtime calls handler, and has no optional catch binding */
var HANDOFF_HEADER = 'x-wc-beta-tests';
// Replaced at deploy: the git hash of cache/cloudfront_functions, and the
// cookie domain ('' for host-only)
var VERSION = '__VERSION__';
var COOKIE_DOMAIN = '__COOKIE_DOMAIN__';
var SIX_MONTHS = 60 * 60 * 24 * 182;

function attributes(maxAge) {
  var parts = ['Path=/', `Max-Age=${maxAge}`, 'Secure', 'SameSite=Lax'];
  if (COOKIE_DOMAIN) parts.push(`Domain=${COOKIE_DOMAIN}`);
  return parts.join('; ');
}

function setCookie(response, name, cookieValue) {
  response.cookies[name] = {
    value: cookieValue,
    attributes: attributes(SIX_MONTHS),
  };
}

function deleteCookie(response, name) {
  response.cookies[name] = { value: '', attributes: attributes(0) };
}

function handler(event) {
  var response = event.response;
  try {
    var request = event.request;
    response.headers['x-wc-beta-tests-version'] = { value: VERSION };

    var handoff = request.headers[HANDOFF_HEADER];
    if (!handoff) return response;

    if (handoff.value === 'clear') {
      if (request.cookies.wc_ab_bucket) deleteCookie(response, 'wc_ab_bucket');
      if (request.cookies.wc_ab) deleteCookie(response, 'wc_ab');
      return response;
    }

    // set;BUCKET;ENTRIES
    var fields = handoff.value.split(';');
    if (fields.length !== 3 || fields[0] !== 'set') return response;
    setCookie(response, 'wc_ab_bucket', fields[1]);
    if (fields[2]) {
      setCookie(response, 'wc_ab', fields[2]);
    } else if (request.cookies.wc_ab) {
      deleteCookie(response, 'wc_ab');
    }
  } catch (e) {
    // Fall through: the page is served without changing the visitor's cookies
  }
  return response;
}
