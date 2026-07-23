import { screen } from '@testing-library/react';

import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
  createOpenPainting,
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
});
