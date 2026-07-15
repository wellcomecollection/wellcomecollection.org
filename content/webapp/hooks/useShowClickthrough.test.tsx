import { act, renderHook } from '@testing-library/react';

import { TransformedAuthService } from '@weco/content/utils/iiif/v3';

import useShowClickthrough from './useShowClickthrough';

// The hook shows a clickthrough prompt for restricted content, then hides it
// once the auth iframe posts back an access token from the token service's
// origin. This characterises that logged-in message handling without a real
// auth flow.
const tokenService = 'https://iiif.wellcomecollection.org/auth/v2/token';
// Derived from tokenService (as the hook itself does) rather than a second
// hard-coded constant, so the two can't drift out of sync.
const tokenOrigin = new URL(tokenService).origin;

const clickThroughService: TransformedAuthService = {
  id: 'https://iiif.wellcomecollection.org/auth/v2/access/clickthrough',
};

const postMessage = (data: unknown, origin: string) =>
  act(() => {
    window.dispatchEvent(new MessageEvent('message', { data, origin }));
  });

describe('useShowClickthrough', () => {
  it('is false when there is no clickthrough service', () => {
    const { result } = renderHook(() =>
      useShowClickthrough(undefined, tokenService)
    );
    expect(result.current).toBe(false);
  });

  it('is true when a clickthrough service is present', () => {
    const { result } = renderHook(() =>
      useShowClickthrough(clickThroughService, tokenService)
    );
    expect(result.current).toBe(true);
  });

  it('hides the clickthrough when the token-service origin posts an access token', () => {
    const { result } = renderHook(() =>
      useShowClickthrough(clickThroughService, tokenService)
    );
    expect(result.current).toBe(true);

    postMessage({ accessToken: 'abc' }, tokenOrigin);
    expect(result.current).toBe(false);
  });

  it('keeps the clickthrough shown when the token-service origin posts no token', () => {
    const { result } = renderHook(() =>
      useShowClickthrough(clickThroughService, tokenService)
    );

    postMessage({ someOtherField: true }, tokenOrigin);
    expect(result.current).toBe(true);
  });

  it('ignores messages from a different origin', () => {
    const { result } = renderHook(() =>
      useShowClickthrough(clickThroughService, tokenService)
    );

    postMessage({ accessToken: 'abc' }, 'https://evil.example.com');
    expect(result.current).toBe(true);
  });

  it('ignores messages when tokenService is undefined', () => {
    const { result } = renderHook(() =>
      useShowClickthrough(clickThroughService, undefined)
    );
    expect(result.current).toBe(true);

    postMessage({ accessToken: 'abc' }, tokenOrigin);
    expect(result.current).toBe(true);
  });

  it('hides clickthrough when accessToken is present but empty', () => {
    const { result } = renderHook(() =>
      useShowClickthrough(clickThroughService, tokenService)
    );

    postMessage({ accessToken: '' }, tokenOrigin);
    expect(result.current).toBe(false);
  });
});
