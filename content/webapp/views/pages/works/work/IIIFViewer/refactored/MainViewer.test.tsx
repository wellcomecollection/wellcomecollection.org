import { screen } from '@testing-library/react';

import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';

import MainViewer from './MainViewer';

// The refactored components read from ItemViewerContextRefactored via the
// useItemViewerContext hook, which checks the feature flag. Mock it so the
// hook returns the refactored context values.
jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ itemViewerRefactor: true }),
}));

// MainViewer is a pure router, so its own tests only need to assert it picks
// the right child - the children's own behaviour is covered by their own tests.
jest.mock('./VirtualizedImageViewer', () => ({
  __esModule: true,
  default: () => <div data-testid="virtualized-image-viewer" />,
}));

jest.mock('./PaginatedItemViewer', () => ({
  __esModule: true,
  default: () => <div data-testid="paginated-item-viewer" />,
}));

const renderMainViewer = (hasOnlyRenderableImages: boolean) =>
  renderWithContext(<MainViewer />, {
    contextProps: { hasOnlyRenderableImages },
    useRefactoredContext: true,
  });

describe('MainViewer', () => {
  it('renders VirtualizedImageViewer when the manifest has only renderable images', () => {
    renderMainViewer(true);

    expect(screen.getByTestId('virtualized-image-viewer')).toBeInTheDocument();
    expect(
      screen.queryByTestId('paginated-item-viewer')
    ).not.toBeInTheDocument();
  });

  it('renders PaginatedItemViewer when the manifest has non-image or born-digital items', () => {
    renderMainViewer(false);

    expect(screen.getByTestId('paginated-item-viewer')).toBeInTheDocument();
    expect(
      screen.queryByTestId('virtualized-image-viewer')
    ).not.toBeInTheDocument();
  });
});
