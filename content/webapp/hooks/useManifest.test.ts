import { renderHook, waitFor } from '@testing-library/react';

import { DigitalLocation } from '@weco/common/model/catalogue';
import { fetchIIIFPresentationManifest } from '@weco/content/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/content/services/iiif/transformers/manifest';
import { createMockManifest } from '@weco/content/test/fixtures/iiif/transformed-manifest';

import useManifest from './useManifest';

jest.mock('@weco/content/services/iiif/fetch/manifest');
jest.mock('@weco/content/services/iiif/transformers/manifest');

const mockFetchManifest = fetchIIIFPresentationManifest as jest.Mock;
const mockTransformManifest = transformManifest as jest.Mock;

// A stand-in for a raw IIIF manifest: just enough for the mocked
// transformManifest below to identify which url it came from.
type RawManifest = { id: string };

const location = (url: string): DigitalLocation => ({ url }) as DigitalLocation;

let urlCounter = 0;
// Each test gets its own url(s), since the hook's caches are module-level
// singletons shared across every renderHook call in this file.
const uniqueUrl = () => `https://iiif.example.com/manifest/${urlCounter++}`;

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  mockFetchManifest.mockReset();
  mockTransformManifest.mockReset();
  mockTransformManifest.mockImplementation((raw: RawManifest) =>
    createMockManifest({ id: raw.id, title: raw.id })
  );
});

describe('useManifest', () => {
  it('fetches and transforms the manifest for a given location', async () => {
    const url = uniqueUrl();
    mockFetchManifest.mockResolvedValue({ id: url } as RawManifest);

    const { result } = renderHook(() =>
      useManifest(location(url), 'workTypeX')
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.transformedManifest).toBeUndefined();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.transformedManifest?.id).toBe(url);
    expect(result.current.error).toBeUndefined();
    expect(mockFetchManifest).toHaveBeenCalledWith({
      location: url,
      workTypeId: 'workTypeX',
    });
  });

  it('reuses an already-resolved manifest for the same url without refetching', async () => {
    const url = uniqueUrl();
    mockFetchManifest.mockResolvedValue({ id: url } as RawManifest);

    const first = renderHook(() => useManifest(location(url)));
    await waitFor(() => expect(first.result.current.isLoading).toBe(false));
    expect(mockFetchManifest).toHaveBeenCalledTimes(1);

    const second = renderHook(() => useManifest(location(url)));

    // Cached data is available synchronously - no loading state at all.
    expect(second.result.current.isLoading).toBe(false);
    expect(second.result.current.transformedManifest?.id).toBe(url);
    expect(mockFetchManifest).toHaveBeenCalledTimes(1);
  });

  it('dedupes concurrent fetches for the same in-flight url', async () => {
    const url = uniqueUrl();
    const deferred = createDeferred<RawManifest>();
    mockFetchManifest.mockImplementation(() => deferred.promise);

    const a = renderHook(() => useManifest(location(url)));
    const b = renderHook(() => useManifest(location(url)));

    expect(a.result.current.isLoading).toBe(true);
    expect(b.result.current.isLoading).toBe(true);
    expect(mockFetchManifest).toHaveBeenCalledTimes(1);

    deferred.resolve({ id: url });

    await waitFor(() => expect(a.result.current.isLoading).toBe(false));
    await waitFor(() => expect(b.result.current.isLoading).toBe(false));

    expect(a.result.current.transformedManifest?.id).toBe(url);
    expect(b.result.current.transformedManifest?.id).toBe(url);
  });

  it('sets an error and clears loading when the fetch rejects, and allows a later retry', async () => {
    const url = uniqueUrl();
    const failure = new Error('network blip');
    mockFetchManifest.mockRejectedValueOnce(failure);

    const { result, unmount } = renderHook(() => useManifest(location(url)));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe(failure);
    expect(result.current.transformedManifest).toBeUndefined();

    unmount();

    // The failed fetch must not have permanently cached a rejected promise
    // for this url - a subsequent attempt should retry, not replay the
    // same rejection.
    mockFetchManifest.mockResolvedValueOnce({ id: url } as RawManifest);

    const retry = renderHook(() => useManifest(location(url)));
    await waitFor(() => expect(retry.result.current.isLoading).toBe(false));

    expect(retry.result.current.error).toBeUndefined();
    expect(retry.result.current.transformedManifest?.id).toBe(url);
    expect(mockFetchManifest).toHaveBeenCalledTimes(2);
  });

  it('does not expose the previous location manifest while a new one is loading', async () => {
    const urlA = uniqueUrl();
    const urlB = uniqueUrl();

    mockFetchManifest.mockResolvedValueOnce({ id: urlA } as RawManifest);

    const { result, rerender } = renderHook(
      ({ loc }: { loc?: DigitalLocation }) => useManifest(loc),
      { initialProps: { loc: location(urlA) } }
    );

    await waitFor(() =>
      expect(result.current.transformedManifest?.id).toBe(urlA)
    );

    const deferredB = createDeferred<RawManifest>();
    mockFetchManifest.mockImplementationOnce(() => deferredB.promise);

    rerender({ loc: location(urlB) });

    // Work A's manifest must not leak into work B's loading state.
    expect(result.current.transformedManifest).toBeUndefined();
    expect(result.current.isLoading).toBe(true);

    deferredB.resolve({ id: urlB });

    await waitFor(() =>
      expect(result.current.transformedManifest?.id).toBe(urlB)
    );
  });

  it('clears the manifest and stops loading when the location becomes absent', async () => {
    const url = uniqueUrl();
    mockFetchManifest.mockResolvedValueOnce({ id: url } as RawManifest);

    const { result, rerender } = renderHook(
      ({ loc }: { loc?: DigitalLocation }) => useManifest(loc),
      { initialProps: { loc: location(url) as DigitalLocation | undefined } }
    );

    await waitFor(() =>
      expect(result.current.transformedManifest?.id).toBe(url)
    );

    rerender({ loc: undefined });

    expect(result.current.transformedManifest).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });
});
