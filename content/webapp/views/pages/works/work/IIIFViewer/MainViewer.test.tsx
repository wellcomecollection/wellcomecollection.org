import { screen } from '@testing-library/react';

import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';

import MainViewer from './MainViewer';

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

  it('wraps whichever child renders in the main-viewer container', () => {
    // MainViewer owns the main-viewer container directly - children don't
    // render their own wrapper - so this is the one test that exercises it.
    renderMainViewer(true);

    const mainViewer = screen.getByTestId('main-viewer');
    expect(mainViewer).toContainElement(
      screen.getByTestId('virtualized-image-viewer')
    );
  });
});
