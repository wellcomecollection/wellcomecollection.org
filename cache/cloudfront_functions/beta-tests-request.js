// Assigns consenting visitors to the running beta tests before the cache
// lookup, and writes their cohort onto the request as toggle_ID cookies.
// Design: RFC 094 in wellcomecollection/docs. Runtime: cloudfront-js-2.0,
// which is ES5.1 plus some later features, so keep to var/const and loops.
/* eslint no-unused-vars: ["error", { "caughtErrors": "none", "varsIgnorePattern": "^handler$" }] -- the runtime calls handler, and has no optional catch binding */
import cf from 'cloudfront';
import crypto from 'crypto';

// Passes the visitor's cookies to beta-tests-response.js
var HANDOFF_HEADER = 'x-wc-beta-tests';
var ENTRY_PATTERN = /^[A-Za-z0-9_-]+:[0-9]+:(variant|control|outside)$/;
var BUCKET_PATTERN = /^[0-9]{1,4}$/;

function hasAnalyticsConsent(cookies) {
  var consent = cookies.CookieControl;
  if (!consent) return false;
  try {
    var parsed = JSON.parse(decodeURIComponent(consent.value));
    return Boolean(
      parsed &&
      parsed.optionalCookies &&
      parsed.optionalCookies.analytics === 'accepted'
    );
  } catch (e) {
    return false;
  }
}

// A list that can't be parsed is discarded whole and rebuilt from the hash
function parseEntries(cookie) {
  var entries = {};
  if (!cookie || !cookie.value) return entries;
  var parts = cookie.value.split('|');
  for (var i = 0; i < parts.length; i++) {
    if (!ENTRY_PATTERN.test(parts[i])) return {};
    var fields = parts[i].split(':');
    entries[fields[0]] = {
      version: parseInt(fields[1], 10),
      cohort: fields[2],
    };
  }
  return entries;
}

// Two independent numbers from 0 to 99: one for enrolment, one for the split
function draw(testId, bucket) {
  var hash = crypto
    .createHash('sha256')
    .update(`${testId}:${bucket}`)
    .digest('hex');
  return {
    enrolment: parseInt(hash.slice(0, 8), 16) % 100,
    split: parseInt(hash.slice(8, 16), 16) % 100,
  };
}

// /_next/data/BUILD/works/abc.json is the page /works/abc
function pagePath(uri) {
  var match = /^\/_next\/data\/[^/]+(\/.*)\.json$/.exec(uri);
  if (!match) return uri;
  return match[1] === '/index' ? '/' : match[1];
}

function covers(test, path) {
  var paths = test.paths || [];
  for (var i = 0; i < paths.length; i++) {
    var prefix = paths[i];
    if (path === prefix || path.indexOf(`${prefix}/`) === 0) return true;
  }
  return false;
}

function isValidTest(test) {
  return Boolean(
    test &&
    typeof test.id === 'string' &&
    typeof test.version === 'number' &&
    typeof test.enrolment === 'number' &&
    typeof test.split === 'number'
  );
}

function assign(test, existing, bucket) {
  if (
    existing &&
    (existing.cohort !== 'outside' || existing.version === test.version)
  ) {
    return existing;
  }
  var numbers = draw(test.id, bucket);
  var drawn = 'outside';
  if (numbers.enrolment < test.enrolment) {
    drawn = numbers.split < test.split ? 'variant' : 'control';
  }
  return { version: test.version, cohort: drawn };
}

async function readTests() {
  var raw = await cf.kvs().get('tests', { format: 'json' });
  if (!Array.isArray(raw)) throw new Error('tests is not a list');
  return raw.filter(isValidTest);
}

async function handler(event) {
  var request = event.request;
  try {
    var cookies = request.cookies;

    // Kiosks show a different version of the site to a different audience
    if (cookies.toggle_kioskMode) return request;

    var tests;
    try {
      tests = await readTests();
    } catch (e) {
      // A missing or unreadable store leaves visitors and their cookies alone
      return request;
    }

    if (tests.length === 0 || !hasAnalyticsConsent(cookies)) {
      request.headers[HANDOFF_HEADER] = { value: 'clear' };
      return request;
    }

    var bucketCookie = cookies.wc_ab_bucket;
    var bucket =
      bucketCookie && BUCKET_PATTERN.test(bucketCookie.value)
        ? parseInt(bucketCookie.value, 10)
        : Math.floor(Math.random() * 10000);
    var stored = parseEntries(cookies.wc_ab);
    var path = pagePath(request.uri);

    var entries = [];
    var requestCookies = {};
    var removeCookies = [];
    for (var i = 0; i < tests.length; i++) {
      var test = tests[i];
      var personal = cookies[`toggle_${test.id}`];

      // Staff previews take priority and are not recorded
      if (
        personal &&
        (personal.value === 'true' || personal.value === 'false')
      ) {
        if (stored[test.id]) {
          entries.push(
            `${test.id}:${stored[test.id].version}:${stored[test.id].cohort}`
          );
        }
        continue;
      }

      var assignment = assign(test, stored[test.id], bucket);
      entries.push(`${test.id}:${assignment.version}:${assignment.cohort}`);

      if (!covers(test, path)) continue;
      if (assignment.cohort === 'outside') {
        removeCookies.push(`toggle_${test.id}`);
      } else {
        var isVariant = assignment.cohort === 'variant';
        requestCookies[`toggle_${test.id}`] = isVariant ? 'true' : 'false';
        if (isVariant && test.flag && test.value) {
          requestCookies[`toggle_${test.flag}`] = test.value;
        }
      }
    }

    // Applied last, so an error above leaves the request unchanged
    var names = Object.keys(requestCookies);
    for (var j = 0; j < names.length; j++) {
      cookies[names[j]] = { value: requestCookies[names[j]] };
    }
    for (var k = 0; k < removeCookies.length; k++) {
      delete cookies[removeCookies[k]];
    }
    request.headers[HANDOFF_HEADER] = {
      value: `set;${bucket};${entries.join('|')}`,
    };
    return request;
  } catch (e) {
    return event.request;
  }
}
