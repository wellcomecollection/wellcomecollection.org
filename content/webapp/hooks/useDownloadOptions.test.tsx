import { renderHook } from '@testing-library/react';
import { FunctionComponent, PropsWithChildren } from 'react';

import { DigitalLocation } from '@weco/common/model/catalogue';
import ItemViewerContextRefactored, {
  defaultItemViewerContext,
  ItemViewerContextProps,
} from '@weco/content/contexts/ItemViewerContext/refactored';
import {
  createMockCanvas,
  createMockManifest,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';
import { TransformedCanvas } from '@weco/content/types/manifest';

import useDownloadOptions from './useDownloadOptions';

// useDownloadOptions combines every source of downloadable files for the
// current canvas/manifest into one deduplicated list, extracted from
// ViewerTopBar.tsx (which still has its own "download button" tests covering
// the on-screen behaviour - these characterise the hook's own logic directly).

const mockDigitalLocation = (url: string): DigitalLocation => ({
  locationType: { id: 'iiif-image', label: '', type: 'LocationType' },
  url,
  license: { id: 'cc-by', label: '', url: '', type: 'License' },
  accessConditions: [],
  type: 'DigitalLocation',
});

const imageService = (overrides: Record<string, unknown> = {}) => ({
  '@id': 'https://iiif.wellcomecollection.org/image/b00000000_0001.jp2',
  '@type': 'ImageService2',
  width: 1000,
  height: 1400,
  ...overrides,
});

const paintingWithImageService = (
  overrides: Record<string, unknown> = {}
): TransformedCanvas['painting'][number] =>
  ({
    id: 'https://example.com/image/open',
    type: 'Image',
    service: [imageService()],
    ...overrides,
  }) as unknown as TransformedCanvas['painting'][number];

// A mutable context value the Wrapper below reads fresh on every render, so
// tests can vary it across a rerender() call (renderHook's `wrapper` is fixed
// at setup time and never receives rerender's props directly).
let mockContextValue: ItemViewerContextProps = defaultItemViewerContext;

const Wrapper: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <ItemViewerContextRefactored.Provider value={mockContextValue}>
    {children}
  </ItemViewerContextRefactored.Provider>
);

function renderDownloadOptions(
  contextValue: Partial<ItemViewerContextProps>,
  iiifImageLocation?: DigitalLocation
) {
  mockContextValue = { ...defaultItemViewerContext, ...contextValue };
  return renderHook(
    ({ iiifImageLocation }: { iiifImageLocation?: DigitalLocation }) =>
      useDownloadOptions(iiifImageLocation),
    { wrapper: Wrapper, initialProps: { iiifImageLocation } }
  );
}

describe('useDownloadOptions', () => {
  it('returns an empty array when there is no canvas or manifest', () => {
    const { result } = renderDownloadOptions({
      currentCanvas: undefined,
      transformedManifest: undefined,
    });

    expect(result.current).toEqual([]);
  });

  it('includes IIIF image download options when given an iiifImageLocation', () => {
    const { result } = renderDownloadOptions(
      { currentCanvas: undefined, transformedManifest: undefined },
      mockDigitalLocation(
        'https://iiif.wellcomecollection.org/image/b00000000_0001.jp2'
      )
    );

    expect(result.current).toEqual([
      expect.objectContaining({ label: expect.stringContaining('image') }),
      expect.objectContaining({ label: expect.stringContaining('image') }),
    ]);
  });

  it('includes canvas image downloads from the painting image service', () => {
    const { result } = renderDownloadOptions({
      currentCanvas: createMockCanvas({
        painting: [paintingWithImageService()],
      }),
    });

    expect(result.current).toEqual([
      expect.objectContaining({
        id: 'https://iiif.wellcomecollection.org/image/b00000000_0001.jp2/full/full/0/default.jpg',
      }),
      expect.objectContaining({
        id: 'https://iiif.wellcomecollection.org/image/b00000000_0001.jp2/full/760%2C/0/default.jpg',
      }),
    ]);
  });

  it('resolves the image service through a ChoiceBody painting item', () => {
    const { result } = renderDownloadOptions({
      currentCanvas: createMockCanvas({
        painting: [
          {
            type: 'Choice',
            items: [paintingWithImageService()],
          } as unknown as TransformedCanvas['painting'][number],
        ],
      }),
    });

    expect(result.current).toHaveLength(2);
  });

  it('includes canvas rendering downloads (e.g. PDFs)', () => {
    const { result } = renderDownloadOptions({
      currentCanvas: createMockCanvas({
        rendering: [
          {
            id: 'https://example.com/whole.pdf',
            type: 'Text',
            format: 'application/pdf',
          },
        ] as unknown as TransformedCanvas['rendering'],
      }),
    });

    expect(result.current).toEqual([
      expect.objectContaining({
        id: 'https://example.com/whole.pdf',
        format: 'application/pdf',
      }),
    ]);
  });

  it('includes manifest-level rendering downloads', () => {
    const { result } = renderDownloadOptions({
      transformedManifest: createMockManifest({
        rendering: [
          {
            id: 'https://example.com/manifest-download.pdf',
            type: 'Text',
            format: 'application/pdf',
          },
        ],
      }),
    });

    expect(result.current).toEqual([
      expect.objectContaining({
        id: 'https://example.com/manifest-download.pdf',
      }),
    ]);
  });

  it('includes video/audio downloads from the painting items', () => {
    const { result } = renderDownloadOptions({
      currentCanvas: createMockCanvas({
        painting: [
          {
            id: 'https://example.com/video.mp4',
            type: 'Video',
            format: 'video/mp4',
          } as unknown as TransformedCanvas['painting'][number],
        ],
      }),
    });

    expect(result.current).toEqual([
      expect.objectContaining({
        id: 'https://example.com/video.mp4',
        label: 'This video',
      }),
    ]);
  });

  it('deduplicates download options that share the same id across sources', () => {
    const sharedId = 'https://example.com/duplicated.pdf';
    const { result } = renderDownloadOptions({
      currentCanvas: createMockCanvas({
        rendering: [
          { id: sharedId, type: 'Text', format: 'application/pdf' },
        ] as unknown as TransformedCanvas['rendering'],
      }),
      transformedManifest: createMockManifest({
        rendering: [{ id: sharedId, type: 'Text', format: 'application/pdf' }],
      }),
    });

    expect(result.current).toHaveLength(1);
  });

  describe('memoisation', () => {
    const canvasWithRendering = () =>
      createMockCanvas({
        rendering: [
          {
            id: 'https://example.com/whole.pdf',
            type: 'Text',
            format: 'application/pdf',
          },
        ] as unknown as TransformedCanvas['rendering'],
      });

    it('returns the same array reference across a rerender with unchanged inputs', () => {
      mockContextValue = {
        ...defaultItemViewerContext,
        currentCanvas: canvasWithRendering(),
      };
      const { result, rerender } = renderHook(
        ({ iiifImageLocation }: { iiifImageLocation?: DigitalLocation }) =>
          useDownloadOptions(iiifImageLocation),
        { wrapper: Wrapper, initialProps: { iiifImageLocation: undefined } }
      );

      const firstResult = result.current;
      rerender({ iiifImageLocation: undefined });

      expect(result.current).toBe(firstResult);
    });

    it('recalculates when the current canvas changes', () => {
      mockContextValue = {
        ...defaultItemViewerContext,
        currentCanvas: canvasWithRendering(),
      };
      const { result, rerender } = renderHook(
        ({ iiifImageLocation }: { iiifImageLocation?: DigitalLocation }) =>
          useDownloadOptions(iiifImageLocation),
        { wrapper: Wrapper, initialProps: { iiifImageLocation: undefined } }
      );

      const firstResult = result.current;

      mockContextValue = {
        ...mockContextValue,
        currentCanvas: createMockCanvas({ rendering: [] }),
      };
      rerender({ iiifImageLocation: undefined });

      expect(result.current).not.toBe(firstResult);
      expect(result.current).toEqual([]);
    });
  });
});
