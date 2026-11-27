import * as prismic from '@prismicio/client';

import {
  redactAccessTokens,
  redactAccessTokensFromConsole,
  redactAccessTokensFromPayload,
} from './redact-access-tokens';

const prismicUrl =
  'https://wellcomecollection.cdn.prismic.io/api/v2/documents/search?q=x&ref=abc&access_token=not-a-real-token&x-c=js-7.23.0';

describe('redactAccessTokens', () => {
  it('replaces the token and keeps the rest of the URL', () => {
    expect(redactAccessTokens(prismicUrl)).toBe(
      'https://wellcomecollection.cdn.prismic.io/api/v2/documents/search?q=x&ref=abc&access_token=[redacted]&x-c=js-7.23.0'
    );
  });

  it('leaves text without a token alone', () => {
    expect(redactAccessTokens('GET /stories 200')).toBe('GET /stories 200');
  });
});

describe('redactAccessTokensFromPayload', () => {
  it("redacts the token from an APM error's attributes", () => {
    const payload = {
      exception: { message: 'Server error', attributes: { url: prismicUrl } },
    };

    expect(
      redactAccessTokensFromPayload(payload).exception.attributes.url
    ).toContain('access_token=[redacted]');
  });
});

describe('redactAccessTokensFromConsole', () => {
  const originalError = console.error;
  const originalLog = console.log;
  let printed: string[];

  beforeEach(() => {
    printed = [];
    console.error = jest.fn((text: string) => printed.push(text));
    console.log = jest.fn((text: string) => printed.push(text));
    redactAccessTokensFromConsole();
  });

  afterEach(() => {
    console.error = originalError;
    console.log = originalLog;
  });

  it('redacts the token from a printed Prismic error', () => {
    console.error(new prismic.PrismicError('Server error', prismicUrl, ''));

    expect(printed[0]).toContain('access_token=[redacted]');
    expect(printed[0]).not.toContain('not-a-real-token');
  });

  it('still prints everything else', () => {
    console.log('Received HTTP %i from %s', 503, 'the API');

    expect(printed[0]).toBe('Received HTTP 503 from the API');
  });
});
