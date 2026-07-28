import { act, fireEvent, screen, waitFor } from '@testing-library/react';

import { ItemViewerContextProps } from '@weco/content/contexts/ItemViewerContext';
import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
  createMockQuery,
  createMockSearchHit,
  createMockSearchResults,
  createOpenPainting,
  createRestrictedPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import VirtualizedImageViewer from './VirtualizedImageViewer';

// The refactored components read from ItemViewerContextRefactored via the
// useItemViewerContext hook, which checks the feature flag. Mock it so the
// hook returns the refactored context values.
jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ itemViewerRefactor: true }),
}));

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

// The FixedSizeList's outer element. This viewer renders it as its own root,
// so it's the first div in the tree.
const getScrollContainer = (container: HTMLElement) =>
  container.querySelector('div')!;

const renderViewer = (contextProps: Partial<ItemViewerContextProps> = {}) =>
  renderWithContext(<VirtualizedImageViewer />, {
    contextProps,
    useRefactoredContext: true,
  });

describe('VirtualizedImageViewer', () => {
  // One test below swaps in fake timers. Restore real ones unconditionally, so
  // a failed assertion can't leave the rest of the file running under them.
  afterEach(() => {
    jest.useRealTimers();
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
    expect(images[0]).toHaveAttribute('src', 'https://example.com/image/open');
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
    // than endorsed: see the note on the PR.
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

    expect(screen.getByTestId('image-item')).toHaveStyle({ marginTop: '2em' });
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
