import { act, fireEvent, screen, waitFor } from '@testing-library/react';

import { ItemViewerContextProps } from '@weco/content/contexts/ItemViewerContext/legacy';
import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockAuth,
  createMockCanvas,
  createMockManifest,
  createMockQuery,
  createMockSearchHit,
  createMockSearchResults,
  createOpenPainting,
  createRestrictedPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import MainViewer, { getOverlayTopLeft, RotationValue } from './MainViewer';

// The legacy counterpart to the refactored viewer tests. Legacy MainViewer is
// both viewers in one component, so the two describes below mirror
// refactored/VirtualizedImageViewer.test.tsx and
// refactored/PaginatedItemViewer.test.tsx respectively, test for test.
//
// The bodies are deliberately kept identical to their refactored twins, so
// that a diff between the files shows only what the split actually changed.
// Unlike those files we don't mock useFeatureFlags, so useItemViewerContext
// resolves to the legacy context.
//
// Not mirrored: refactored/MainViewer.test.tsx, which asserts the router picks
// the right child component. Legacy has no child components to pick between -
// it branches internally, which the two describes here cover between them.

// jsdom doesn't implement IntersectionObserver, which the image item's
// scroll-to-url-update behaviour relies on via useOnScreen.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}
window.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

// The FixedSizeList's outer element. Legacy renders it inside
// MainViewerContainer, so it's one level down rather than at the root.
const getScrollContainer = (container: HTMLElement) =>
  container.querySelector('[data-testid="main-viewer"] > div')!;

const createVideoCanvas = (id = 'https://example.com/video.mp4') =>
  createMockCanvas({
    painting: [{ id, type: 'Video', format: 'video/mp4' }] as never,
  });

describe('MainViewer (legacy)', () => {
  // One test below swaps in fake timers. Restore real ones unconditionally, so
  // a failed assertion can't leave the rest of the file running under them.
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('when the manifest has only renderable images', () => {
    const renderViewer = (contextProps: Partial<ItemViewerContextProps> = {}) =>
      renderWithContext(<MainViewer />, {
        contextProps: { hasOnlyRenderableImages: true, ...contextProps },
      });

    it('renders the fixed-list scroll container sized to the main area', () => {
      const { container } = renderViewer();

      expect(getScrollContainer(container)).toHaveStyle({
        width: '1000px',
        height: '500px',
      });
    });

    it('renders the virtualized image items for the canvases in view', () => {
      renderViewer({
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({ painting: [createOpenPainting()] }),
            createMockCanvas({ painting: [createOpenPainting()] }),
          ],
        }),
      });

      // Both canvases fall within the FixedSizeList's rendered/overscan range
      // given the default mainAreaHeight/itemSize, so both images are present.
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute(
        'src',
        'https://example.com/image/open'
      );
    });

    it('scrolls to the current canvas position on mount, accounting for landscape aspect ratio', () => {
      const { container } = renderViewer({
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({
              width: 1000,
              height: 1000,
              painting: [createOpenPainting()],
            }),
            // Landscape: scrollViewer centres the shorter rendered image within
            // the square FixedSizeList row instead of scrolling to its top.
            createMockCanvas({
              width: 2000,
              height: 1000,
              painting: [createOpenPainting()],
            }),
          ],
        }),
        query: createMockQuery({ canvas: 2 }),
      });

      // The scroll happens on mount via the effect on `canvas`, since the query
      // defaults to shouldScrollToCanvas - not via the debounced onItemsRendered.
      //
      // scrollViewer isn't exported, so its maths is asserted through the DOM:
      // FixedSizeList.scrollTo() writes scrollTop on its outer element, and jsdom
      // records that despite never laying anything out. If react-window ever stops
      // driving scroll position imperatively, this fails loudly rather than
      // quietly passing.
      //
      // mainAreaWidth/itemSize default to 1000, mainAreaHeight to 500.
      // renderedHeight = 1000 * (1000/2000) * 0.8 = 400
      // heightOfPreviousItems = 1 * 1000 = 1000
      // distanceToScroll = 1000 + (1000 - 400) / 2 = 1300
      expect(getScrollContainer(container).scrollTop).toBe(1300);
    });

    it('scrolls to the top of the current canvas on mount when it is portrait', () => {
      const { container } = renderViewer({
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({
              width: 1000,
              height: 1400,
              painting: [createOpenPainting()],
            }),
            createMockCanvas({
              width: 1000,
              height: 1400,
              painting: [createOpenPainting()],
            }),
          ],
        }),
        query: createMockQuery({ canvas: 2 }),
      });

      // Portrait canvases skip the centring maths above entirely: scrollViewer
      // calls scrollToItem(1, 'start'), putting the top of the second item at the
      // top of the viewport - 1 * itemSize = 1000.
      expect(getScrollContainer(container).scrollTop).toBe(1000);
    });

    it('skips the canvas-change scroll when shouldScrollToCanvas is false', () => {
      jest.useFakeTimers();

      const { container } = renderViewer({
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({
              width: 2000,
              height: 1000,
              painting: [createOpenPainting()],
            }),
            createMockCanvas({
              width: 2000,
              height: 1000,
              painting: [createOpenPainting()],
            }),
          ],
        }),
        query: createMockQuery({ canvas: 2, shouldScrollToCanvas: false }),
      });

      // The flag is set when the canvas changed *because* the viewer was
      // scrolled, so scrolling again would fight the user. It suppresses the
      // effect on `canvas`.
      expect(getScrollContainer(container).scrollTop).toBe(0);

      // It does not suppress the first-render scroll behind onItemsRendered,
      // though - that path doesn't consult the flag, so the viewer still jumps
      // once the 500ms debounce elapses. Pinned here as current behaviour rather
      // than endorsed.
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(getScrollContainer(container).scrollTop).toBe(1300);
    });

    it('hides controls while scrolling and restores them once scrolling settles', () => {
      jest.useFakeTimers();
      const setShowControls = jest.fn();

      const { container } = renderViewer({
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas({ painting: [createOpenPainting()] })],
        }),
        setShowControls,
      });

      act(() => {
        fireEvent.scroll(getScrollContainer(container), {
          target: { scrollTop: 100 },
        });
      });
      expect(setShowControls).toHaveBeenCalledWith(false);

      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(setShowControls).toHaveBeenCalledWith(true);
    });

    it('adds top margin to the first item when it is restricted, to clear the restricted-access banner', () => {
      renderViewer({
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({ painting: [createRestrictedPainting()] }),
          ],
        }),
      });

      expect(screen.getByTestId('image-item')).toHaveStyle({
        marginTop: '2em',
      });
    });

    it('renders a search-hit highlight overlay for a matching canvas', async () => {
      const canvasId =
        'https://iiif.wellcomecollection.org/presentation/v3/b00000000/canvases/b00000000_0001.jp2';
      const imageId =
        'https://iiif.wellcomecollection.org/image/b00000000_0001.jp2';

      renderViewer({
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({
              id: canvasId,
              // Needs a real ImageService2 item (not the plain <img> fallback
              // that createOpenPainting gives us) - only the ImageViewer path
              // measures and reports back the image position the overlay needs.
              painting: [
                {
                  id: imageId,
                  type: 'Image',
                  service: [{ '@id': imageId, '@type': 'ImageService2' }],
                } as never,
              ],
            }),
          ],
        }),
        searchResults: createMockSearchResults({
          resources: [
            createMockSearchHit({ on: `${canvasId}#xywh=100,200,50,60` }),
          ],
        }),
      });

      // The overlay only appears once the image has reported its measured
      // position back up, which happens in an effect after the initial render.
      await waitFor(() =>
        expect(screen.getByTestId('search-term-highlight')).toBeInTheDocument()
      );
    });
  });

  describe('when the manifest has non-image or born-digital items', () => {
    const renderViewer = (contextProps: Partial<ItemViewerContextProps> = {}) =>
      renderWithContext(<MainViewer />, {
        contextProps: { hasOnlyRenderableImages: false, ...contextProps },
      });

    it('renders the current item', () => {
      const { container } = renderViewer({
        transformedManifest: createMockManifest({
          canvases: [createVideoCanvas()],
        }),
      });

      expect(
        container.querySelector('[data-component="video-player"]')
      ).toBeInTheDocument();
    });

    it('hides the fullscreen control, since the paginated viewer never supports it', () => {
      const setShowFullscreenControl = jest.fn();

      renderViewer({
        transformedManifest: createMockManifest({
          canvases: [createVideoCanvas()],
        }),
        setShowFullscreenControl,
      });

      expect(setShowFullscreenControl).toHaveBeenCalledWith(false);
    });

    it('renders the item for the canvas number associated with the query', () => {
      const { container } = renderViewer({
        transformedManifest: createMockManifest({
          canvases: [
            createVideoCanvas('https://example.com/video-1.mp4'),
            createVideoCanvas('https://example.com/video-2.mp4'),
          ],
        }),
        query: createMockQuery({ canvas: 2 }),
      });

      expect(container.querySelector('source')).toHaveAttribute(
        'src',
        'https://example.com/video-2.mp4'
      );
    });

    it('renders a PDF item from the canvas originals', () => {
      renderViewer({
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({
              original: [
                {
                  id: 'https://example.com/doc.pdf',
                  type: 'Text',
                  format: 'application/pdf',
                  behavior: 'original',
                },
              ] as never,
            }),
          ],
        }),
      });

      expect(screen.getByRole('link', { name: /open/i })).toBeInTheDocument();
    });

    it('renders a download link for a born-digital archive item', () => {
      renderViewer({
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({
              painting: [
                { id: 'https://example.com/placeholder', type: 'Image' },
              ] as never,
              original: [
                {
                  id: 'https://example.com/file.docx',
                  format: 'application/msword',
                  behavior: 'original',
                },
              ] as never,
            }),
          ],
        }),
      });

      expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute(
        'href',
        'https://example.com/file.docx'
      );
    });

    it('passes the manifest access service through to restricted items', () => {
      renderViewer({
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({
              painting: [
                createRestrictedPainting({
                  id: 'https://example.com/doc.pdf',
                  type: 'Text',
                  format: 'application/pdf',
                }),
              ],
            }),
          ],
          auth: createMockAuth({
            externalAccessService: {
              id: 'https://example.com/access',
              label: 'Restricted access notice',
            },
          }),
        }),
      });

      expect(
        screen.getByRole('heading', { name: 'Restricted access notice' })
      ).toBeInTheDocument();
    });

    it('renders nothing when the current canvas cannot be resolved', () => {
      renderViewer({
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas()],
        }),
        query: createMockQuery({ canvas: 99 }),
      });

      // Legacy always renders MainViewerContainer, so unlike the refactored
      // viewer the container itself remains - it just has nothing in it.
      expect(screen.getByTestId('main-viewer')).toBeEmptyDOMElement();
    });
  });
});

describe('getOverlayTopLeft', () => {
  const imageContainerRect = { top: 10, left: 20 } as unknown as DOMRect;
  const imageRect = {
    top: 30,
    left: 50,
    width: 200,
    height: 100,
  } as unknown as DOMRect;
  const x = 15;
  const y = 8;

  // startTop = imageRect.top - imageContainerRect.top = 20
  // startLeft = imageRect.left - imageContainerRect.left = 30
  const expectedByRotation: Record<
    RotationValue,
    { overlayTop: number; overlayLeft: number }
  > = {
    0: { overlayTop: 28, overlayLeft: 45 },
    90: { overlayTop: 35, overlayLeft: 222 },
    180: { overlayTop: 112, overlayLeft: 215 },
    270: { overlayTop: 105, overlayLeft: 38 },
  };

  it.each([0, 90, 180, 270] as RotationValue[])(
    'computes the overlay position for a %d degree rotation',
    rotation => {
      const result = getOverlayTopLeft({
        imageContainerRect,
        imageRect,
        rotation,
        x,
        y,
      });

      expect(result).toEqual(expectedByRotation[rotation]);
    }
  );
});
