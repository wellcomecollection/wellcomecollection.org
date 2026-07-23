import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import PaginatedItemViewer from './PaginatedItemViewer';

// The refactored components read from ItemViewerContextRefactored via the
// useItemViewerContext hook, which checks the feature flag. Mock it so the
// hook returns the refactored context values.
jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ itemViewerRefactor: true }),
}));

const renderViewer = (setShowFullscreenControl = jest.fn()) => {
  const videoCanvas = createMockCanvas({
    painting: [
      {
        id: 'https://example.com/video.mp4',
        type: 'Video',
        format: 'video/mp4',
      },
    ] as never,
  });

  return renderWithContext(<PaginatedItemViewer />, {
    contextProps: {
      transformedManifest: createMockManifest({ canvases: [videoCanvas] }),
      setShowFullscreenControl,
    },
    useRefactoredContext: true,
  });
};

describe('PaginatedItemViewer', () => {
  it('renders the current item', () => {
    const { container } = renderViewer();

    expect(
      container.querySelector('[data-component="video-player"]')
    ).toBeInTheDocument();
  });

  it('hides the fullscreen control, since the paginated viewer never supports it', () => {
    const setShowFullscreenControl = jest.fn();
    renderViewer(setShowFullscreenControl);

    expect(setShowFullscreenControl).toHaveBeenCalledWith(false);
  });
});
