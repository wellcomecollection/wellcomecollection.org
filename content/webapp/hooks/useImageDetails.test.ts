import { act, renderHook } from '@testing-library/react';

import { fetchIIIFPresentationManifest } from '@weco/content/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/content/services/iiif/transformers/manifest';
import { Image, Work } from '@weco/content/services/wellcome/catalogue/types';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';

import useImageDetails from './useImageDetails';

jest.mock('@weco/content/services/wellcome/catalogue/works', () => ({
  getWorkClientSide: jest.fn(),
}));

jest.mock('@weco/content/services/iiif/fetch/manifest', () => ({
  fetchIIIFPresentationManifest: jest.fn(),
}));

jest.mock('@weco/content/services/iiif/transformers/manifest', () => ({
  transformManifest: jest.fn(),
}));

const mockGetWork = getWorkClientSide as jest.Mock;
const mockFetchManifest = fetchIIIFPresentationManifest as jest.Mock;
const mockTransformManifest = transformManifest as jest.Mock;

const image = (id: string, workId: string) =>
  ({
    id,
    source: { id: workId },
    locations: [{ url: `https://iiif.example/${id}/info.json` }],
  }) as unknown as Image;

const work = (title: string, manifestUrl?: string) =>
  ({
    type: 'Work',
    title,
    items: manifestUrl
      ? [
          {
            locations: [
              {
                type: 'DigitalLocation',
                locationType: { id: 'iiif-presentation' },
                url: manifestUrl,
              },
            ],
          },
        ]
      : [],
    production: [],
  }) as unknown as Work;

// A manifest whose canvases show the given images, in order
const manifestWith = (...imageIds: string[]) => ({
  canvases: imageIds.map(id => ({
    imageServiceId: `https://iiif.example/${id}`,
  })),
});

const linkCanvas = (link: unknown) =>
  JSON.stringify(link).match(/canvas\W+(\d+)/)?.[1];

const deferred = () => {
  let resolve!: (value: Work) => void;
  const promise = new Promise<Work>(r => {
    resolve = r;
  });
  return { promise, resolve };
};

const imageA = image('imageA', 'workA');
const imageB = image('imageB', 'workB');
const page1 = image('page1', 'book');
const page2 = image('page2', 'book');

describe('useImageDetails', () => {
  beforeEach(() => {
    mockGetWork.mockReset();
    mockFetchManifest.mockReset();
    mockTransformManifest.mockReset();
  });

  it('ignores a response for an image that is no longer selected', async () => {
    const a = deferred();
    const b = deferred();
    mockGetWork.mockImplementation((id: string) =>
      id === 'workA' ? a.promise : b.promise
    );

    const { result, rerender } = renderHook(
      ({ expandedImage }) => useImageDetails([imageA, imageB], expandedImage),
      { initialProps: { expandedImage: imageA as Image | undefined } }
    );
    rerender({ expandedImage: imageB });

    // B's work arrives first, then A's, which is now stale
    await act(async () => b.resolve(work('Work B')));
    await act(async () => a.resolve(work('Work A')));

    expect(result.current.detailedWork?.title).toBe('Work B');
  });

  it('drops the details when the image is closed and loads them again on reopening', async () => {
    mockGetWork.mockResolvedValue(work('Work A'));

    const { result, rerender } = renderHook(
      ({ expandedImage }) => useImageDetails([imageA], expandedImage),
      { initialProps: { expandedImage: imageA as Image | undefined } }
    );
    await act(async () => {});
    expect(result.current.detailedWork?.title).toBe('Work A');

    rerender({ expandedImage: undefined });
    expect(result.current.detailedWork).toBeUndefined();

    rerender({ expandedImage: imageA });
    await act(async () => {});

    expect(mockGetWork).toHaveBeenCalledTimes(2);
    expect(result.current.detailedWork?.title).toBe('Work A');
  });

  it('ignores a work that arrives after the image was closed', async () => {
    const a = deferred();
    mockGetWork.mockReturnValue(a.promise);

    const { result, rerender } = renderHook(
      ({ expandedImage }) => useImageDetails([imageA], expandedImage),
      { initialProps: { expandedImage: imageA as Image | undefined } }
    );
    rerender({ expandedImage: undefined });
    await act(async () => a.resolve(work('Work A')));

    expect(result.current.detailedWork).toBeUndefined();
  });

  it("doesn't send the next image to the previous image's canvas", async () => {
    mockGetWork.mockImplementation(async (id: string) =>
      id === 'workA'
        ? work('Work A', 'https://iiif.example/manifestA')
        : work('Work B')
    );
    mockFetchManifest.mockResolvedValue({});
    mockTransformManifest.mockReturnValue(manifestWith('other', 'imageA'));

    const { result, rerender } = renderHook(
      ({ expandedImage }) => useImageDetails([imageA, imageB], expandedImage),
      { initialProps: { expandedImage: imageA as Image | undefined } }
    );
    await act(async () => {});
    expect(JSON.stringify(result.current.expandedImageLink)).toContain(
      'canvas'
    );

    rerender({ expandedImage: imageB });
    await act(async () => {});

    expect(result.current.detailedWork?.title).toBe('Work B');
    expect(JSON.stringify(result.current.expandedImageLink)).not.toContain(
      'canvas'
    );
  });

  it('ignores a manifest for an image that is no longer selected', async () => {
    let resolveManifest!: (value: unknown) => void;
    mockGetWork.mockImplementation(async (id: string) =>
      id === 'workA'
        ? work('Work A', 'https://iiif.example/manifestA')
        : work('Work B')
    );
    mockFetchManifest.mockReturnValue(
      new Promise(r => {
        resolveManifest = r;
      })
    );
    mockTransformManifest.mockReturnValue(manifestWith('other', 'imageA'));

    const { result, rerender } = renderHook(
      ({ expandedImage }) => useImageDetails([imageA, imageB], expandedImage),
      { initialProps: { expandedImage: imageA as Image | undefined } }
    );
    await act(async () => {});
    rerender({ expandedImage: imageB });
    await act(async () => {});

    // A's manifest arrives after B was selected
    await act(async () => resolveManifest({}));

    expect(JSON.stringify(result.current.expandedImageLink)).not.toContain(
      'canvas'
    );
  });

  describe('images from the same work', () => {
    const bookWork = () => work('Book', 'https://iiif.example/manifestBook');

    it("looks up the canvas for each image, not just the first one's", async () => {
      mockGetWork.mockResolvedValue(bookWork());
      mockFetchManifest.mockResolvedValue({});
      mockTransformManifest.mockReturnValue(
        manifestWith('other', 'page1', 'other', 'page2')
      );

      const { result, rerender } = renderHook(
        ({ expandedImage }) => useImageDetails([page1, page2], expandedImage),
        { initialProps: { expandedImage: page1 as Image | undefined } }
      );
      await act(async () => {});
      expect(linkCanvas(result.current.expandedImageLink)).toBe('2');

      rerender({ expandedImage: page2 });
      await act(async () => {});

      expect(linkCanvas(result.current.expandedImageLink)).toBe('4');
    });

    it('ignores a manifest lookup for the image that was selected before', async () => {
      let resolveFirst!: (value: unknown) => void;
      mockGetWork.mockResolvedValue(bookWork());
      mockFetchManifest
        .mockReturnValueOnce(
          new Promise(r => {
            resolveFirst = r;
          })
        )
        .mockResolvedValue({});
      mockTransformManifest.mockReturnValue(
        manifestWith('other', 'page1', 'other', 'page2')
      );

      const { result, rerender } = renderHook(
        ({ expandedImage }) => useImageDetails([page1, page2], expandedImage),
        { initialProps: { expandedImage: page1 as Image | undefined } }
      );
      await act(async () => {});
      rerender({ expandedImage: page2 });
      await act(async () => {});
      expect(linkCanvas(result.current.expandedImageLink)).toBe('4');

      // Page 1's lookup finishes after page 2 was selected
      await act(async () => resolveFirst({}));

      expect(linkCanvas(result.current.expandedImageLink)).toBe('4');
    });
  });
});
