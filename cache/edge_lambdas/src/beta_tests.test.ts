import fs from 'fs';
import path from 'path';

import {
  compiledFunction,
  functionsDir,
  Kvs,
  loadFunction,
} from './test_cloudfront_functions';

type Cookies = Record<string, { value: string }>;

type RunningTest = {
  id: string;
  version: number;
  enrolment: number;
  split: number;
  paths?: string[];
  flag?: string;
  value?: string;
};

const consented = encodeURIComponent(
  JSON.stringify({ optionalCookies: { analytics: 'accepted' } })
);
const declined = encodeURIComponent(
  JSON.stringify({ optionalCookies: { analytics: 'revoked' } })
);

const storeWith = (tests: unknown): Kvs => ({
  get: async () => tests,
});

const failingStore: Kvs = {
  get: async () => {
    throw new Error('key not found');
  },
};

const testA: RunningTest = {
  id: 'testA',
  version: 1,
  enrolment: 100,
  split: 50,
  paths: ['/works'],
};

function requestEvent(uri: string, cookies: Cookies) {
  return {
    version: '1.0',
    context: { eventType: 'viewer-request' },
    request: { method: 'GET', uri, querystring: {}, headers: {}, cookies },
  };
}

async function runRequest(
  tests: RunningTest[] | Kvs,
  cookies: Cookies,
  uri = '/works/abc'
) {
  const kvs = Array.isArray(tests) ? storeWith(tests) : tests;
  const handler = loadFunction('beta-tests-request', { kvs });
  return handler(requestEvent(uri, cookies));
}

function handoff(request: { headers: Record<string, { value: string }> }) {
  return request.headers['x-wc-beta-tests']?.value;
}

function entriesOf(request: { headers: Record<string, { value: string }> }) {
  const [, , entries] = handoff(request).split(';');
  return entries;
}

describe('beta-tests-request', () => {
  it('assigns a consenting visitor and writes the cohort onto a covered request', async () => {
    const request = await runRequest([testA], {
      CookieControl: { value: consented },
    });

    const [kind, bucket, entries] = handoff(request).split(';');
    expect(kind).toBe('set');
    expect(Number(bucket)).toBeGreaterThanOrEqual(0);
    expect(Number(bucket)).toBeLessThan(10000);
    expect(entries).toMatch(/^testA:1:(variant|control)$/);
    const isVariant = entries.endsWith('variant');
    expect(request.cookies.toggle_testA.value).toBe(String(isVariant));
  });

  it('records the assignment but leaves the cache key alone on a page the test does not cover', async () => {
    const request = await runRequest(
      [testA],
      { CookieControl: { value: consented }, wc_ab_bucket: { value: '42' } },
      '/stories/abc'
    );

    expect(handoff(request)).toMatch(/^set;42;testA:1:(variant|control)$/);
    expect(request.cookies.toggle_testA).toBeUndefined();
  });

  it('matches whole path segments', async () => {
    const request = await runRequest(
      [testA],
      { CookieControl: { value: consented }, wc_ab_bucket: { value: '42' } },
      '/worksheets'
    );

    expect(request.cookies.toggle_testA).toBeUndefined();
  });

  it('covers client-side navigation through /_next/data', async () => {
    const homepageTest = { ...testA, paths: ['/'] };
    const covered = await runRequest(
      [testA],
      { CookieControl: { value: consented } },
      '/_next/data/build123/works/abc.json'
    );
    const homepage = await runRequest(
      [homepageTest],
      { CookieControl: { value: consented } },
      '/_next/data/build123/index.json'
    );

    expect(covered.cookies.toggle_testA).toBeDefined();
    expect(homepage.cookies.toggle_testA).toBeDefined();
  });

  it('gives the same visitor the same cohort on every request', async () => {
    const cookies = {
      CookieControl: { value: consented },
      wc_ab_bucket: { value: '1234' },
    };
    const first = await runRequest([testA], { ...cookies });
    const second = await runRequest([testA], { ...cookies });

    expect(entriesOf(second)).toBe(entriesOf(first));
  });

  it('keeps a stored variant or control entry whatever the version', async () => {
    const request = await runRequest([{ ...testA, version: 3, enrolment: 0 }], {
      CookieControl: { value: consented },
      wc_ab_bucket: { value: '1' },
      wc_ab: { value: 'testA:1:variant' },
    });

    expect(entriesOf(request)).toBe('testA:1:variant');
    expect(request.cookies.toggle_testA.value).toBe('true');
  });

  it('keeps an outside entry made under the current version', async () => {
    const request = await runRequest([{ ...testA, version: 2 }], {
      CookieControl: { value: consented },
      wc_ab_bucket: { value: '1' },
      wc_ab: { value: 'testA:2:outside' },
    });

    expect(entriesOf(request)).toBe('testA:2:outside');
    expect(request.cookies.toggle_testA).toBeUndefined();
  });

  it('assigns an outside entry again when the version changes', async () => {
    const request = await runRequest([{ ...testA, version: 2 }], {
      CookieControl: { value: consented },
      wc_ab_bucket: { value: '1' },
      wc_ab: { value: 'testA:1:outside' },
    });

    expect(entriesOf(request)).toMatch(/^testA:2:(variant|control)$/);
  });

  it('drops entries for tests that are no longer running', async () => {
    const request = await runRequest([testA], {
      CookieControl: { value: consented },
      wc_ab_bucket: { value: '1' },
      wc_ab: { value: 'finished:1:variant|testA:1:control' },
    });

    expect(entriesOf(request)).toBe('testA:1:control');
  });

  it('leaves a staff preview alone and does not record it', async () => {
    const request = await runRequest([testA], {
      CookieControl: { value: consented },
      wc_ab_bucket: { value: '1' },
      toggle_testA: { value: 'false' },
    });

    expect(request.cookies.toggle_testA.value).toBe('false');
    expect(entriesOf(request)).toBe('');
  });

  it('removes a stray test cookie for a visitor outside the test', async () => {
    const request = await runRequest([{ ...testA, enrolment: 0 }], {
      CookieControl: { value: consented },
      toggle_testA: { value: 'junk' },
    });

    expect(entriesOf(request)).toBe('testA:1:outside');
    expect(request.cookies.toggle_testA).toBeUndefined();
  });

  it("sets the flag's value for visitors in the variant", async () => {
    const flagTest = {
      ...testA,
      split: 100,
      flag: 'somePhasedFlag',
      value: 'phase2',
    };
    const request = await runRequest([flagTest], {
      CookieControl: { value: consented },
    });

    expect(request.cookies.toggle_testA.value).toBe('true');
    expect(request.cookies.toggle_somePhasedFlag.value).toBe('phase2');
  });

  it('does not set the flag for visitors in the control', async () => {
    const flagTest = {
      ...testA,
      split: 0,
      flag: 'somePhasedFlag',
      value: 'phase2',
    };
    const request = await runRequest([flagTest], {
      CookieControl: { value: consented },
    });

    expect(request.cookies.toggle_testA.value).toBe('false');
    expect(request.cookies.toggle_somePhasedFlag).toBeUndefined();
  });

  it('does not assign visitors who have not consented, and asks for their cookies to be cleared', async () => {
    const visitors: Cookies[] = [
      {},
      { CookieControl: { value: declined } },
      { CookieControl: { value: '%7Bnot json' } },
    ];
    for (const cookies of visitors) {
      const request = await runRequest([testA], cookies);
      expect(handoff(request)).toBe('clear');
      expect(request.cookies.toggle_testA).toBeUndefined();
    }
  });

  it('asks for cookies to be cleared when no test is running', async () => {
    const request = await runRequest([], {
      CookieControl: { value: consented },
    });

    expect(handoff(request)).toBe('clear');
  });

  it('leaves out staff who have turned on betaTestsExempt', async () => {
    const request = await runRequest([testA], {
      CookieControl: { value: consented },
      wc_ab: { value: 'testA:1:variant' },
      toggle_betaTestsExempt: { value: 'true' },
    });

    expect(handoff(request)).toBe('clear');
    expect(request.cookies.toggle_testA).toBeUndefined();
    // The server reads it too, so the toggle widget shows it as on
    expect(request.cookies.toggle_betaTestsExempt.value).toBe('true');
  });

  it('still lets exempt staff preview a version', async () => {
    const request = await runRequest([testA], {
      CookieControl: { value: consented },
      toggle_betaTestsExempt: { value: 'true' },
      toggle_testA: { value: 'true' },
    });

    expect(handoff(request)).toBe('clear');
    expect(request.cookies.toggle_testA.value).toBe('true');
  });

  it('assigns as normal when betaTestsExempt has any other value', async () => {
    const request = await runRequest([testA], {
      CookieControl: { value: consented },
      toggle_betaTestsExempt: { value: 'false' },
    });

    expect(entriesOf(request)).toMatch(/^testA:1:/);
    expect(request.cookies.toggle_betaTestsExempt.value).toBe('false');
  });

  it('leaves kiosks out of every test', async () => {
    const request = await runRequest([testA], {
      CookieControl: { value: consented },
      toggle_kioskMode: { value: 'RR-iPad1' },
    });

    expect(handoff(request)).toBeUndefined();
    expect(request.cookies.toggle_testA).toBeUndefined();
  });

  it('rebuilds an unreadable list and replaces an invalid bucket', async () => {
    const request = await runRequest([testA], {
      CookieControl: { value: consented },
      wc_ab_bucket: { value: '99999' },
      wc_ab: { value: 'testA:1:variant|not an entry' },
    });

    const [, bucket, entries] = handoff(request).split(';');
    expect(Number(bucket)).toBeLessThan(10000);
    expect(entries).toMatch(/^testA:1:(variant|control)$/);
  });

  it('ignores malformed tests in the store', async () => {
    const request = await runRequest([testA, { id: 'broken' } as RunningTest], {
      CookieControl: { value: consented },
    });

    expect(entriesOf(request)).toMatch(/^testA:1:/);
  });

  it('leaves the request unchanged when the store cannot be read', async () => {
    for (const kvs of [failingStore, storeWith('not a list')]) {
      const request = await runRequest(kvs, {
        CookieControl: { value: consented },
        wc_ab: { value: 'testA:1:variant' },
      });
      expect(handoff(request)).toBeUndefined();
      expect(request.cookies.toggle_testA).toBeUndefined();
    }
  });

  it('removes a hand-off header the visitor sent, whichever way it returns', async () => {
    const forged = { value: 'set;9999;forged:1:variant' };
    const consentedCookies = { CookieControl: { value: consented } };
    const cases: [RunningTest[] | Kvs, Cookies][] = [
      [[testA], { ...consentedCookies, toggle_kioskMode: { value: 'x' } }],
      [failingStore, consentedCookies],
    ];

    for (const [tests, cookies] of cases) {
      const kvs = Array.isArray(tests) ? storeWith(tests) : tests;
      const handler = loadFunction('beta-tests-request', { kvs });
      const event = requestEvent('/works', cookies);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event.request.headers as any)['x-wc-beta-tests'] = forged;

      expect(handoff(await handler(event))).toBeUndefined();
    }
  });

  it('passes its own version to the response function, whatever the visitor sent', async () => {
    const consentedCookies = { CookieControl: { value: consented } };
    const cases: [RunningTest[] | Kvs, Cookies][] = [
      [[testA], consentedCookies],
      [[testA], { ...consentedCookies, toggle_kioskMode: { value: 'x' } }],
      [failingStore, consentedCookies],
      [[testA], {}],
    ];

    for (const [tests, cookies] of cases) {
      const kvs = Array.isArray(tests) ? storeWith(tests) : tests;
      const handler = loadFunction('beta-tests-request', {
        kvs,
        version: 'abc',
      });
      const event = requestEvent('/works', cookies);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event.request.headers as any)['x-wc-beta-tests-request-version'] = {
        value: 'forged',
      };

      const request = await handler(event);
      expect(request.headers['x-wc-beta-tests-request-version'].value).toBe(
        'abc'
      );
    }
  });

  it('returns the request when anything else goes wrong', async () => {
    const handler = loadFunction('beta-tests-request', {
      kvs: storeWith([testA]),
    });
    const event = requestEvent('/works', {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event.request as any).cookies = null;

    expect(await handler(event)).toBe(event.request);
  });

  describe('across many visitors', () => {
    async function cohorts(test: RunningTest) {
      const handler = loadFunction('beta-tests-request', {
        kvs: storeWith([test]),
      });
      const result: string[] = [];
      for (let bucket = 0; bucket < 10000; bucket++) {
        const request = await handler(
          requestEvent('/works', {
            CookieControl: { value: consented },
            wc_ab_bucket: { value: String(bucket) },
          })
        );
        result.push(entriesOf(request).split(':')[2]);
      }
      return result;
    }

    const share = (values: string[], cohort: string) =>
      values.filter(value => value === cohort).length / values.length;

    it('gives each cohort the share its definition sets', async () => {
      const result = await cohorts({ ...testA, enrolment: 50, split: 20 });

      expect(share(result, 'outside')).toBeCloseTo(0.5, 1);
      expect(share(result, 'variant')).toBeCloseTo(0.1, 1);
      expect(share(result, 'control')).toBeCloseTo(0.4, 1);
    });

    it('selects visitors for two tests with the same percentages independently', async () => {
      const first = await cohorts({ ...testA, id: 'first', split: 20 });
      const second = await cohorts({ ...testA, id: 'second', split: 20 });
      const inBoth = first.filter(
        (cohort, i) => cohort === 'variant' && second[i] === 'variant'
      ).length;

      // With independent draws at 20% each, about 4% of visitors are in both variants
      expect(inBoth / first.length).toBeCloseTo(0.04, 1);
    });
  });
});

describe('beta-tests-response', () => {
  function responseEvent(
    handoffValue: string | undefined,
    requestCookies: Cookies = {},
    requestHeaders: Record<string, { value: string }> = {}
  ) {
    return {
      version: '1.0',
      context: { eventType: 'viewer-response' },
      request: {
        method: 'GET',
        uri: '/works',
        querystring: {},
        headers: handoffValue
          ? { ...requestHeaders, 'x-wc-beta-tests': { value: handoffValue } }
          : requestHeaders,
        cookies: requestCookies,
      },
      response: { statusCode: 200, headers: {}, cookies: {} },
    };
  }

  it('stores the bucket and assignments for six months, host-only', () => {
    const handler = loadFunction('beta-tests-response', { version: 'abc' });
    const response = handler(responseEvent('set;42;testA:1:variant'));

    expect(response.headers['x-wc-beta-tests-version'].value).toBe('abc');
    expect(response.cookies.wc_ab_bucket).toEqual({
      value: '42',
      attributes: 'Path=/; Max-Age=15724800; Secure; SameSite=Lax',
    });
    expect(response.cookies.wc_ab.value).toBe('testA:1:variant');
  });

  it("shows the request function's version next to its own", () => {
    const handler = loadFunction('beta-tests-response', { version: 'abc' });
    const response = handler(
      responseEvent(
        undefined,
        {},
        {
          'x-wc-beta-tests-request-version': { value: 'def' },
        }
      )
    );

    expect(response.headers['x-wc-beta-tests-version'].value).toBe('abc');
    expect(response.headers['x-wc-beta-tests-request-version'].value).toBe(
      'def'
    );
  });

  it('shows no request version when the request function did not run', () => {
    const handler = loadFunction('beta-tests-response');
    const response = handler(responseEvent(undefined));

    expect(response.headers['x-wc-beta-tests-request-version']).toBeUndefined();
  });

  it('sets the cookie domain where one is configured', () => {
    const handler = loadFunction('beta-tests-response', {
      cookieDomain: '.wellcomecollection.org',
    });
    const response = handler(responseEvent('set;42;testA:1:variant'));

    expect(response.cookies.wc_ab.attributes).toContain(
      'Domain=.wellcomecollection.org'
    );
  });

  it('removes the list when the visitor has no assignments left', () => {
    const handler = loadFunction('beta-tests-response');
    const response = handler(
      responseEvent('set;42;', { wc_ab: { value: 'old:1:variant' } })
    );

    expect(response.cookies.wc_ab_bucket.value).toBe('42');
    expect(response.cookies.wc_ab.attributes).toContain('Max-Age=0');
  });

  it("clears the visitor's cookies when asked to", () => {
    const handler = loadFunction('beta-tests-response');
    const response = handler(
      responseEvent('clear', {
        wc_ab_bucket: { value: '42' },
        wc_ab: { value: 'testA:1:variant' },
      })
    );

    expect(response.cookies.wc_ab_bucket.attributes).toContain('Max-Age=0');
    expect(response.cookies.wc_ab.attributes).toContain('Max-Age=0');
  });

  it('sets no cookies when there is nothing to clear or no hand-off', () => {
    const handler = loadFunction('beta-tests-response');

    expect(handler(responseEvent('clear')).cookies).toEqual({});
    expect(handler(responseEvent(undefined)).cookies).toEqual({});
  });
});

describe('compiled output', () => {
  it.each(['beta-tests-request', 'beta-tests-response'])(
    '%s fits the 10 KB CloudFront Functions limit',
    name => {
      const source = compiledFunction(name, {
        version: 'a'.repeat(12),
        cookieDomain: '.wellcomecollection.org',
      });
      expect(Buffer.byteLength(source)).toBeLessThan(10 * 1024);
    }
  );

  // cloudfront-js-2.0 has no module system beyond its own imports, and lacks
  // the ES2018+ features TypeScript would otherwise compile to helpers for
  it.each(['beta-tests-request', 'beta-tests-response'])(
    '%s uses only what the runtime supports',
    name => {
      const source = compiledFunction(name);
      for (const unsupported of [
        /^export /m,
        /\brequire\(/,
        /\b__\w+\(/,
        /Object\.assign/,
        /\?\./,
        /\?\?/,
        /\.\.\./,
        /\.flat(Map)?\(/,
      ]) {
        expect(source).not.toMatch(unsupported);
      }
      const imports = source.match(/^import .*$/gm) || [];
      for (const line of imports) {
        expect(line).toMatch(/from '(cloudfront|crypto)';$/);
      }
    }
  );
});

// The same events CI passes to `aws cloudfront test-function` before publishing
describe('sample events', () => {
  const eventsDir = path.join(functionsDir, 'test-events');
  const events = fs
    .readdirSync(eventsDir)
    .filter(name => name.endsWith('.json'));
  // The deploy checks the same .expect text in test-function's output
  function expectSampleOutput(name: string, output: unknown) {
    const expectFile = path.join(eventsDir, name.replace(/\.json$/, '.expect'));
    if (!fs.existsSync(expectFile)) return;
    const lines = fs
      .readFileSync(expectFile, 'utf-8')
      .split('\n')
      .filter(Boolean);
    for (const wanted of lines) {
      expect(JSON.stringify(output)).toContain(wanted);
    }
  }
  const canary = storeWith([
    { id: 'betaTestsCanary', version: 1, enrolment: 100, split: 50, paths: [] },
  ]);

  it.each(events.filter(name => name.startsWith('request-')))(
    '%s returns a request',
    async name => {
      const handler = loadFunction('beta-tests-request', { kvs: canary });
      const event = JSON.parse(
        fs.readFileSync(path.join(eventsDir, name), 'utf-8')
      );
      const result = await handler(event);
      expect(result.uri).toBe(event.request.uri);
      expectSampleOutput(name, result);
    }
  );

  it.each(events.filter(name => name.startsWith('response-')))(
    '%s returns a response',
    name => {
      const handler = loadFunction('beta-tests-response');
      const event = JSON.parse(
        fs.readFileSync(path.join(eventsDir, name), 'utf-8')
      );
      const output = handler(event);
      expect(output.statusCode).toBe(200);
      expectSampleOutput(name, output);
    }
  );
});
