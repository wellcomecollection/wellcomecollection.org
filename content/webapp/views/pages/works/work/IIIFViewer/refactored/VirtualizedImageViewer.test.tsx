import { act, fireEvent, screen, waitFor } from '@testing-library/react';

import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
  createMockQuery,
  createOpenPainting,
  createRestrictedPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';
import { TransformedCanvas } from '@weco/content/types/manifest';

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

const renderViewer = (canvases: TransformedCanvas[] = [createMockCanvas()]) =>
  renderWithContext(<VirtualizedImageViewer />, {
    contextProps: { transformedManifest: createMockManifest({ canvases }) },
    useRefactoredContext: true,
  });

describe('VirtualizedImageViewer', () => {
  it('renders the fixed-list main viewer container', () => {
    renderViewer();

    expect(screen.getByTestId('main-viewer')).toBeInTheDocument();
  });

  it('renders the virtualized image items for the canvases in view', () => {
    renderViewer([
      createMockCanvas({ painting: [createOpenPainting()] }),
      createMockCanvas({ painting: [createOpenPainting()] }),
    ]);

    // Both canvases fall within the FixedSizeList's rendered/overscan range
    // given the default mainAreaHeight/itemSize, so both images are present.
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/image/open');
  });

  it('scrolls to the current canvas position on mount, accounting for landscape aspect ratio', () => {
    const canvases = [
      createMockCanvas({
        width: 1000,
        height: 1000,
        painting: [createOpenPainting()],
      }),
      // Landscape: scrollViewer centres the shorter rendered image within the
      // square FixedSizeList row instead of scrolling straight to its top.
      createMockCanvas({
        width: 2000,
        height: 1000,
        painting: [createOpenPainting()],
      }),
    ];

    const { container } = renderWithContext(<VirtualizedImageViewer />, {
      contextProps: {
        transformedManifest: createMockManifest({ canvases }),
        query: createMockQuery({ canvas: 2 }),
      },
      useRefactoredContext: true,
    });

    // mainAreaWidth/itemSize default to 1000, mainAreaHeight to 500.
    // renderedHeight = 1000 * (1000/2000) * 0.8 = 400
    // heightOfPreviousItems = 1 * 1000 = 1000
    // distanceToScroll = 1000 + (1000 - 400) / 2 = 1300
    const scrollContainer = container.querySelector(
      '[data-testid="main-viewer"] > div'
    );
    expect(scrollContainer?.scrollTop).toBe(1300);
  });

  it('hides controls while scrolling and restores them once scrolling settles', () => {
    jest.useFakeTimers();
    const setShowControls = jest.fn();

    const { container } = renderWithContext(<VirtualizedImageViewer />, {
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas({ painting: [createOpenPainting()] })],
        }),
        setShowControls,
      },
      useRefactoredContext: true,
    });

    const scrollContainer = container.querySelector(
      '[data-testid="main-viewer"] > div'
    )!;

    act(() => {
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 100 } });
    });
    expect(setShowControls).toHaveBeenCalledWith(false);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(setShowControls).toHaveBeenCalledWith(true);

    jest.useRealTimers();
  });

  it('adds top margin to the first item when it is restricted, to clear the restricted-access banner', () => {
    const { container } = renderViewer([
      createMockCanvas({ painting: [createRestrictedPainting()] }),
    ]);

    const itemWrapper = container.querySelector(
      '[data-testid="main-viewer"] > div > div > div > div'
    );
    expect(itemWrapper).toHaveStyle({ marginTop: '2em' });
  });

  it('renders a search-hit highlight overlay for a matching canvas', async () => {
    const canvasId =
      'https://iiif.wellcomecollection.org/presentation/v3/b00000000/canvases/b00000000_0001.jp2';
    const imageId =
      'https://iiif.wellcomecollection.org/image/b00000000_0001.jp2';
    const canvas = createMockCanvas({
      id: canvasId,
      // Needs a real ImageService2 item (not the plain <img> fallback that
      // createOpenPainting gives us) - only the ImageViewer path measures
      // and reports back the image position that the overlay math needs.
      painting: [
        {
          id: imageId,
          type: 'Image',
          service: [{ '@id': imageId, '@type': 'ImageService2' }],
        } as never,
      ],
    });

    const { container } = renderWithContext(<VirtualizedImageViewer />, {
      contextProps: {
        transformedManifest: createMockManifest({ canvases: [canvas] }),
        searchResults: {
          '@context': '',
          '@id': '',
          '@type': 'sc:AnnotationList',
          within: { '@type': '', total: null },
          startIndex: 0,
          resources: [
            {
              '@id': '',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: { '@type': 'cnt:ContentAsText', chars: 'hit' },
              on: `${canvasId}#xywh=100,200,50,60`,
            },
          ],
          hits: [],
        },
      },
      useRefactoredContext: true,
    });

    // The highlight overlay renders as an extra sibling alongside the item
    // wrapper, once the image position effect has run.
    const row = container.querySelector(
      '[data-testid="main-viewer"] > div > div > div'
    );
    await waitFor(() => expect(row?.children).toHaveLength(2));
  });
});
