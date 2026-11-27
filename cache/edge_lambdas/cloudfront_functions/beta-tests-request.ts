// Assigns consenting visitors to the running beta tests before the cache
// lookup, and writes their cohort onto the request as toggle_ID cookies.
// The design is RFC 094 in wellcomecollection/docs.
//
// This is compiled to JavaScript for cloudfront-js-2.0, which is ES5.1 plus
// some later features. It supports const and let, arrow functions, template
// literals and async/await. It doesn't support object spread, optional
// chaining or Array.prototype.flat, and a test checks the compiled output for
// them.
/* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "^handler$" }] -- the runtime calls handler */
import cf from 'cloudfront';
import crypto from 'crypto';

// The git hash of these sources, replaced at deploy. The deploy script reads
// it to tell whether this code is already live, and the stage check reads it
// from the response.
const VERSION = '__VERSION__';
// Passes the visitor's cookies to beta-tests-response
const HANDOFF_HEADER = 'x-wc-beta-tests';
// beta-tests-response copies this onto the response
const VERSION_HEADER = 'x-wc-beta-tests-request-version';
const ENTRY_PATTERN = /^[A-Za-z0-9_-]+:[0-9]+:(variant|control|outside)$/;
const BUCKET_PATTERN = /^[0-9]{1,4}$/;

type Cohort = 'variant' | 'control' | 'outside';
type Assignment = { version: number; cohort: Cohort };

// One entry in the "tests" key of the KeyValueStore
type RunningTest = {
  id: string;
  version: number;
  enrolment: number;
  split: number;
  paths?: string[];
  flag?: string;
  value?: string;
};

function hasAnalyticsConsent(cookies: CloudFrontRequest['cookies']): boolean {
  const consent = cookies.CookieControl;
  if (!consent) return false;
  try {
    const parsed = JSON.parse(decodeURIComponent(consent.value));
    return Boolean(
      parsed &&
      parsed.optionalCookies &&
      parsed.optionalCookies.analytics === 'accepted'
    );
  } catch {
    return false;
  }
}

// A list that can't be parsed is discarded whole and rebuilt from the hash
function parseEntries(
  cookie: CloudFrontValue | undefined
): Record<string, Assignment> {
  const entries: Record<string, Assignment> = {};
  if (!cookie || !cookie.value) return entries;
  const parts = cookie.value.split('|');
  for (let i = 0; i < parts.length; i++) {
    if (!ENTRY_PATTERN.test(parts[i])) return {};
    const fields = parts[i].split(':');
    entries[fields[0]] = {
      version: parseInt(fields[1], 10),
      cohort: fields[2] as Cohort,
    };
  }
  return entries;
}

// Two independent numbers from 0 to 99: one for enrolment, one for the split
function draw(testId: string, bucket: number) {
  const hash = crypto
    .createHash('sha256')
    .update(`${testId}:${bucket}`)
    .digest('hex');
  return {
    enrolment: parseInt(hash.slice(0, 8), 16) % 100,
    split: parseInt(hash.slice(8, 16), 16) % 100,
  };
}

// /_next/data/BUILD/works/abc.json is the page /works/abc
function pagePath(uri: string): string {
  const match = /^\/_next\/data\/[^/]+(\/.*)\.json$/.exec(uri);
  if (!match) return uri;
  return match[1] === '/index' ? '/' : match[1];
}

function covers(test: RunningTest, path: string): boolean {
  const paths = test.paths || [];
  for (let i = 0; i < paths.length; i++) {
    const prefix = paths[i];
    if (path === prefix || path.indexOf(`${prefix}/`) === 0) return true;
  }
  return false;
}

function isValidTest(test: unknown): test is RunningTest {
  const candidate = test as RunningTest | null;
  return Boolean(
    candidate &&
    typeof candidate.id === 'string' &&
    typeof candidate.version === 'number' &&
    typeof candidate.enrolment === 'number' &&
    typeof candidate.split === 'number'
  );
}

function assign(
  test: RunningTest,
  existing: Assignment | undefined,
  bucket: number
): Assignment {
  if (
    existing &&
    (existing.cohort !== 'outside' || existing.version === test.version)
  ) {
    return existing;
  }
  const numbers = draw(test.id, bucket);
  let drawn: Cohort = 'outside';
  if (numbers.enrolment < test.enrolment) {
    drawn = numbers.split < test.split ? 'variant' : 'control';
  }
  return { version: test.version, cohort: drawn };
}

async function readTests(): Promise<RunningTest[]> {
  const raw = await cf.kvs().get('tests', { format: 'json' });
  if (!Array.isArray(raw)) throw new Error('tests is not a list');
  return raw.filter(isValidTest);
}

async function handler(
  event: CloudFrontRequestEvent
): Promise<CloudFrontRequest> {
  const request = event.request;
  try {
    // Only this function may tell the response function what to set
    delete request.headers[HANDOFF_HEADER];
    request.headers[VERSION_HEADER] = { value: VERSION };
    const cookies = request.cookies;

    // Staff leave tests with the betaTestsExempt toggle. It stays on the
    // request so the toggle widget can show it, like any other toggle cookie.
    const isExempt = Boolean(
      cookies.toggle_betaTestsExempt &&
      cookies.toggle_betaTestsExempt.value === 'true'
    );

    // Kiosks show a different version of the site to a different audience
    if (cookies.toggle_kioskMode) return request;

    let tests: RunningTest[];
    try {
      tests = await readTests();
    } catch {
      // A missing or unreadable store leaves visitors and their cookies alone
      return request;
    }

    if (tests.length === 0 || isExempt || !hasAnalyticsConsent(cookies)) {
      request.headers[HANDOFF_HEADER] = { value: 'clear' };
      return request;
    }

    const bucketCookie = cookies.wc_ab_bucket;
    const bucket =
      bucketCookie && BUCKET_PATTERN.test(bucketCookie.value)
        ? parseInt(bucketCookie.value, 10)
        : Math.floor(Math.random() * 10000);
    const stored = parseEntries(cookies.wc_ab);
    const path = pagePath(request.uri);

    const entries: string[] = [];
    const requestCookies: Record<string, string> = {};
    const removeCookies: string[] = [];
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const personal = cookies[`toggle_${test.id}`];

      // Staff previews take priority and are not recorded
      if (
        personal &&
        (personal.value === 'true' || personal.value === 'false')
      ) {
        const kept = stored[test.id];
        if (kept) entries.push(`${test.id}:${kept.version}:${kept.cohort}`);
        continue;
      }

      const assignment = assign(test, stored[test.id], bucket);
      entries.push(`${test.id}:${assignment.version}:${assignment.cohort}`);

      if (!covers(test, path)) continue;
      if (assignment.cohort === 'outside') {
        removeCookies.push(`toggle_${test.id}`);
      } else {
        const isVariant = assignment.cohort === 'variant';
        requestCookies[`toggle_${test.id}`] = isVariant ? 'true' : 'false';
        if (isVariant && test.flag && test.value) {
          requestCookies[`toggle_${test.flag}`] = test.value;
        }
      }
    }

    // Applied last, so an error above leaves the request unchanged
    const names = Object.keys(requestCookies);
    for (let j = 0; j < names.length; j++) {
      cookies[names[j]] = { value: requestCookies[names[j]] };
    }
    for (let k = 0; k < removeCookies.length; k++) {
      delete cookies[removeCookies[k]];
    }
    request.headers[HANDOFF_HEADER] = {
      value: `set;${bucket};${entries.join('|')}`,
    };
    return request;
  } catch {
    return event.request;
  }
}
