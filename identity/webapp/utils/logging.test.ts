import { redactUrl } from './logging';

describe('redactUrl', () => {
  it('redacts query parameters in URLs', () => {
    const url =
      'https://example.com/account?token=supersekrit&state=anothersekrit';
    const redactedUrl = redactUrl(url);

    expect(redactedUrl).toBe(
      'https://example.com/account?token=[redacted]&state=[redacted]'
    );
  });

  it('skips URLs without query parameters', () => {
    const url = 'https://example.com/account';
    const redactedUrl = redactUrl(url);

    expect(redactedUrl).toBe(url);
  });

  it('redacts relative URLs', () => {
    const url = '/account?token=supersekrit&state=anothersekrit';
    const redactedUrl = redactUrl(url);

    expect(redactedUrl).toBe('/account?token=[redacted]&state=[redacted]');
  });
});
