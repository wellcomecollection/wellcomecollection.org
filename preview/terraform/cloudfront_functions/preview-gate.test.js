// Run with: node --test preview/terraform/cloudfront_functions/preview-gate.test.js
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

// CloudFront Functions have no module system, so load the file as a script
const source = fs.readFileSync(path.join(__dirname, 'preview-gate.js'), 'utf8');
const context = {};
vm.runInNewContext(source, context);
const handler = context.handler;

function makeEvent({
  uri = '/',
  headers = {},
  cookies = {},
  querystring = {},
}) {
  const wrap = obj =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, { value: v }]));
  return {
    request: {
      method: 'GET',
      uri,
      headers: wrap(headers),
      cookies: wrap(cookies),
      querystring: wrap(querystring),
    },
  };
}

const prismicReferer = 'https://wellcomecollection.prismic.io/';

function assertPassed(event) {
  assert.strictEqual(handler(event), event.request);
}

function assertRedirected(event, location) {
  const response = handler(event);
  assert.strictEqual(response.statusCode, 302);
  assert.strictEqual(response.headers.location.value, location);
}

test('lets the editor preview entry point through', () => {
  assertPassed(
    makeEvent({
      uri: '/preview',
      querystring: { token: 'test-token', documentId: 'TEST1' },
      headers: { 'sec-fetch-mode': 'navigate', 'sec-fetch-site': 'cross-site' },
    })
  );
});

test('lets the first page after /preview through on the Prismic referer', () => {
  assertPassed(
    makeEvent({
      uri: '/exhibitions/test-exhibition',
      headers: {
        referer: prismicReferer,
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'cross-site',
      },
      cookies: { isPreview: 'true' },
    })
  );
});

test('lets a share link through on the Prismic referer with no cookies', () => {
  assertPassed(
    makeEvent({
      uri: '/stories/test-story',
      headers: { referer: prismicReferer, 'sec-fetch-mode': 'navigate' },
    })
  );
});

test('lets the first page load its own scripts and data', () => {
  assertPassed(
    makeEvent({
      uri: '/_next/static/chunks/test.js',
      headers: { 'sec-fetch-mode': 'no-cors', 'sec-fetch-site': 'same-origin' },
      cookies: { isPreview: 'true' },
    })
  );
  assertPassed(
    makeEvent({
      uri: '/_next/data/test-build/stories/test-story.json',
      headers: { 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'same-origin' },
      cookies: { isPreview: 'true' },
    })
  );
});

test('lets anything with the Prismic preview cookie through', () => {
  assertPassed(
    makeEvent({
      uri: '/stories/test-story',
      headers: { 'sec-fetch-mode': 'navigate', 'sec-fetch-site': 'none' },
      cookies: { 'io.prismic.preview': 'test-session' },
    })
  );
});

test('redirects a page load with no preview signal', () => {
  assertRedirected(
    makeEvent({
      uri: '/stories/test-story',
      headers: { 'sec-fetch-mode': 'navigate', 'sec-fetch-site': 'none' },
      cookies: { isPreview: 'true' },
    }),
    'https://wellcomecollection.org/stories/test-story'
  );
});

test('redirects a request with no headers at all', () => {
  assertRedirected(makeEvent({ uri: '/' }), 'https://wellcomecollection.org/');
});

test('redirects direct data requests that are not from a preview page', () => {
  assertRedirected(
    makeEvent({
      uri: '/_next/data/test-build/stories/test-story.json',
      headers: { 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'none' },
    }),
    'https://wellcomecollection.org/_next/data/test-build/stories/test-story.json'
  );
  assertRedirected(
    makeEvent({
      uri: '/_next/data/test-build/stories/test-story.json',
      headers: { 'sec-fetch-mode': 'cors' },
    }),
    'https://wellcomecollection.org/_next/data/test-build/stories/test-story.json'
  );
});

test('does not trust a referer that only starts with the Prismic origin', () => {
  assertRedirected(
    makeEvent({
      uri: '/',
      headers: {
        referer: 'https://wellcomecollection.prismic.io.example.com/',
      },
    }),
    'https://wellcomecollection.org/'
  );
});

test('keeps the query string on the redirect', () => {
  const event = makeEvent({
    uri: '/search/works',
    querystring: { query: 'test%20query', page: '2' },
  });
  event.request.querystring.subjects = {
    value: 'a',
    multiValue: [{ value: 'a' }, { value: 'b' }],
  };
  assertRedirected(
    event,
    'https://wellcomecollection.org/search/works?query=test%20query&page=2&subjects=a&subjects=b'
  );
});

test('avoids syntax the cloudfront-js-1.0 runtime rejects', () => {
  assert.doesNotMatch(source, /^\s*(const|let)\s/m);
});
