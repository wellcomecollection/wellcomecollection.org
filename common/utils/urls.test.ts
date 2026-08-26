import { appendQueryParam } from './urls';

describe('appendQueryParam', () => {
  it('adds a query param to a URL with no existing query string', () => {
    expect(appendQueryParam('https://example.com/foo', 'retry', '1')).toBe(
      'https://example.com/foo?retry=1'
    );
  });

  it('adds a query param to a URL that already has one', () => {
    expect(appendQueryParam('https://example.com/foo?a=b', 'retry', '1')).toBe(
      'https://example.com/foo?a=b&retry=1'
    );
  });

  it('overwrites an existing param with the same key', () => {
    expect(
      appendQueryParam('https://example.com/foo?retry=1', 'retry', '2')
    ).toBe('https://example.com/foo?retry=2');
  });

  it('works with a relative path with no existing query string', () => {
    expect(appendQueryParam('/foo/bar', 'retry', '1')).toBe('/foo/bar?retry=1');
  });

  it('works with a relative path that already has a query string', () => {
    expect(appendQueryParam('/foo/bar?a=b', 'retry', '1')).toBe(
      '/foo/bar?a=b&retry=1'
    );
  });
});
