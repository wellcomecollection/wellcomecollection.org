import { screen } from '@testing-library/react';
import React from 'react';

import {
  renderWithContext,
  RenderWithContextOptions,
} from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
  createMockQuery,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import ViewerBottomBar from './ViewerBottomBar';

// Mock the fullscreen hook since jsdom doesn't support fullscreen API
jest.mock('@weco/content/hooks/useIsFullscreenEnabled', () => ({
  __esModule: true,
  default: () => true,
}));

function renderBottomBar(options: RenderWithContextOptions = {}) {
  return renderWithContext(<ViewerBottomBar />, {
    appContext: { isEnhanced: true, isFullSupportBrowser: true },
    ...options,
  });
}

describe('ViewerBottomBar navigation (non-image works)', () => {
  it('shows Previous and Next buttons for multi-canvas non-image works', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas(),
            createMockCanvas(),
            createMockCanvas(),
          ],
        }),
        hasOnlyRenderableImages: false,
        query: createMockQuery({ canvas: 2 }),
      },
    });

    expect(screen.getByRole('link', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument();
  });

  it('disables Previous button on first canvas', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas(),
            createMockCanvas(),
            createMockCanvas(),
          ],
        }),
        hasOnlyRenderableImages: false,
        query: createMockQuery({ canvas: 1 }),
      },
    });

    // Previous button should not be a link when disabled (no href)
    const previousButton = screen.getByText(/previous/i).closest('a');
    expect(previousButton).not.toHaveAttribute('href');
  });

  it('disables Next button on last canvas', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas(),
            createMockCanvas(),
            createMockCanvas(),
          ],
        }),
        hasOnlyRenderableImages: false,
        query: createMockQuery({ canvas: 3 }),
      },
    });

    // Next button should not be a link when disabled (no href)
    const nextButton = screen.getByText(/next/i).closest('a');
    expect(nextButton).not.toHaveAttribute('href');
  });

  it('enables both buttons on middle canvas', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas(),
            createMockCanvas(),
            createMockCanvas(),
          ],
        }),
        hasOnlyRenderableImages: false,
        query: createMockQuery({ canvas: 2 }),
      },
    });

    // Both should be links (not disabled)
    const previousButton = screen.getByRole('link', { name: /previous/i });
    const nextButton = screen.getByRole('link', { name: /next/i });

    expect(previousButton).toHaveAttribute('href');
    expect(nextButton).toHaveAttribute('href');
  });

  it('shows page counter with correct canvas position', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas(),
            createMockCanvas(),
            createMockCanvas(),
          ],
        }),
        hasOnlyRenderableImages: false,
        query: createMockQuery({ canvas: 2 }),
      },
    });

    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('does not show navigation for single-canvas works', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas()],
        }),
        hasOnlyRenderableImages: false,
        query: createMockQuery({ canvas: 1 }),
      },
    });

    expect(
      screen.queryByRole('link', { name: /previous/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /next/i })
    ).not.toBeInTheDocument();
  });
});

describe('ViewerBottomBar view controls (image works)', () => {
  it('shows Page/Grid toggle for multi-canvas image works', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas(), createMockCanvas()],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 1 }),
        gridVisible: false,
        isMobileSidebarActive: false,
      },
    });

    expect(screen.getByRole('button', { name: 'Page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Grid' })).toBeInTheDocument();
  });

  it('hides Page/Grid toggle when mobile sidebar is active', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas(), createMockCanvas()],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 1 }),
        gridVisible: false,
        isMobileSidebarActive: true,
      },
    });

    expect(
      screen.queryByRole('button', { name: 'Page' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Grid' })
    ).not.toBeInTheDocument();
  });

  it('hides Page/Grid toggle when zoomed', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas(), createMockCanvas()],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 1 }),
        gridVisible: false,
        showZoomed: true,
      },
    });

    expect(
      screen.queryByRole('button', { name: 'Page' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Grid' })
    ).not.toBeInTheDocument();
  });

  it('does not show Page/Grid toggle for single-canvas works', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas()],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 1 }),
      },
    });

    expect(
      screen.queryByRole('button', { name: 'Page' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Grid' })
    ).not.toBeInTheDocument();
  });

  it('does not show Page/Grid toggle for non-image works', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas(), createMockCanvas()],
        }),
        hasOnlyRenderableImages: false,
        query: createMockQuery({ canvas: 1 }),
      },
    });

    expect(
      screen.queryByRole('button', { name: 'Page' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Grid' })
    ).not.toBeInTheDocument();
  });
});

describe('ViewerBottomBar fullscreen control', () => {
  it('shows fullscreen button when enhanced and fullscreen is enabled', () => {
    renderBottomBar({
      appContext: { isEnhanced: true, isFullSupportBrowser: true },
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas()],
        }),
        hasOnlyRenderableImages: true,
        showFullscreenControl: true,
      },
    });

    expect(
      screen.getByRole('button', { name: /full screen/i })
    ).toBeInTheDocument();
  });

  it('hides fullscreen button when not enhanced', () => {
    renderBottomBar({
      appContext: { isEnhanced: false, isFullSupportBrowser: true },
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas()],
        }),
        hasOnlyRenderableImages: true,
        showFullscreenControl: true,
      },
    });

    expect(
      screen.queryByRole('button', { name: /full screen/i })
    ).not.toBeInTheDocument();
  });

  it('hides fullscreen button when showFullscreenControl is false', () => {
    renderBottomBar({
      appContext: { isEnhanced: true, isFullSupportBrowser: true },
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas()],
        }),
        hasOnlyRenderableImages: true,
        showFullscreenControl: false,
      },
    });

    expect(
      screen.queryByRole('button', { name: /full screen/i })
    ).not.toBeInTheDocument();
  });
});

describe('ViewerBottomBar edge cases', () => {
  it('handles invalid canvas number gracefully (canvas beyond array bounds)', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({ label: '1' }),
            createMockCanvas({ label: '2' }),
          ],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 9999 }), // Way beyond actual canvases
      },
    });

    // Should not crash - bottom bar should render
    expect(screen.getByTestId('bottombar')).toBeInTheDocument();

    // Page/Grid controls should still be usable
    expect(screen.getByRole('button', { name: 'Page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Grid' })).toBeInTheDocument();
  });

  it('handles canvas=0 gracefully (invalid 1-indexed value)', () => {
    renderBottomBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({ label: '1' }),
            createMockCanvas({ label: '2' }),
          ],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 0 }), // Invalid - should be 1-indexed
      },
    });

    // Should not crash - bottom bar should render
    expect(screen.getByTestId('bottombar')).toBeInTheDocument();

    // Page/Grid controls should still be usable
    expect(screen.getByRole('button', { name: 'Page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Grid' })).toBeInTheDocument();
  });
});
