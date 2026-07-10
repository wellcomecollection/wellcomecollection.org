import { screen } from '@testing-library/react';

import {
  renderWithContext,
  RenderWithContextOptions,
} from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
  createMockQuery,
  createRestrictedPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';
import { TransformedManifest } from '@weco/content/types/manifest';

import ViewerTopBar from './ViewerTopBar';

// ViewerTopBar transitively imports the whole viewer (via the `.` barrel that
// re-exports queryParamToArrayIndex), which pulls in openseadragon. It is never
// exercised by this component, so stub it out to avoid the jsdom canvas error.
jest.mock('openseadragon', () => ({ __esModule: true, default: jest.fn() }));

// A manifest-level rendering that yields a non-empty downloadOptions list.
const pdfRendering: TransformedManifest['rendering'] = [
  {
    id: 'https://example.com/whole.pdf',
    type: 'Text',
    format: 'application/pdf',
  },
];

// Renders ViewerTopBar with the enhanced/full-support defaults most of these
// characterisations need, merging in any per-test overrides.
const renderTopBar = (options: RenderWithContextOptions = {}) =>
  renderWithContext(<ViewerTopBar iiifImageLocation={undefined} />, {
    appContext: { isEnhanced: true, isFullSupportBrowser: true },
    ...options,
  });

const downloadButton = (container: HTMLElement) =>
  container.querySelector('[data-component="download-button"]');

describe('ViewerTopBar page-count indicator', () => {
  it('shows the active canvas index, total, and page label for a multi-canvas manifest', () => {
    renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({ label: '1' }),
            createMockCanvas({ label: '2' }),
            createMockCanvas({ label: '3' }),
          ],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 2 }),
      },
    });

    expect(screen.getByTestId('active-index')).toHaveTextContent('2');
    expect(screen.getByTestId('topbar')).toHaveTextContent('/3');
    expect(screen.getByTestId('topbar')).toHaveTextContent(/page 2/);
  });

  it('renders no index indicator for a single-canvas manifest', () => {
    renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas({ label: '1' })],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 1 }),
      },
    });

    expect(screen.queryByTestId('active-index')).not.toBeInTheDocument();
  });

  it('suppresses the page label when the canvas label is "-"', () => {
    renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({ label: '1' }),
            createMockCanvas({ label: '-' }),
          ],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 2 }),
      },
    });

    expect(screen.getByTestId('topbar')).toHaveTextContent('/2');
    expect(screen.getByTestId('topbar')).not.toHaveTextContent(/page \d/);
  });

  it('suppresses the page label when the manifest is not renderable-images-only', () => {
    renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({ label: '1' }),
            createMockCanvas({ label: '2' }),
          ],
        }),
        hasOnlyRenderableImages: false,
        query: createMockQuery({ canvas: 2 }),
      },
    });

    expect(screen.getByTestId('topbar')).toHaveTextContent('/2');
    expect(screen.getByTestId('topbar')).not.toHaveTextContent(/page \d/);
  });

  it('hides the index indicator while zoomed', () => {
    renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas(), createMockCanvas()],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 1 }),
        showZoomed: true,
      },
    });

    expect(screen.queryByTestId('active-index')).not.toBeInTheDocument();
  });

  it('hides the index indicator while resizing', () => {
    renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas(), createMockCanvas()],
        }),
        hasOnlyRenderableImages: true,
        query: createMockQuery({ canvas: 1 }),
        isResizing: true,
      },
    });

    expect(screen.queryByTestId('active-index')).not.toBeInTheDocument();
  });
});

describe('ViewerTopBar download button', () => {
  it('shows the download button for an unrestricted canvas with download options', () => {
    const { container } = renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas()],
          rendering: pdfRendering,
        }),
        query: createMockQuery({ canvas: 1 }),
      },
    });

    expect(downloadButton(container)).toBeInTheDocument();
  });

  it('hides the download button on a restricted canvas for a non-staff user', () => {
    const { container } = renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({ painting: [createRestrictedPainting()] }),
          ],
          rendering: pdfRendering,
        }),
        query: createMockQuery({ canvas: 1 }),
      },
      userContext: { userIsStaffWithRestricted: false },
    });

    expect(downloadButton(container)).not.toBeInTheDocument();
  });

  it('shows the download button on a restricted canvas for a staff user', () => {
    const { container } = renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [
            createMockCanvas({ painting: [createRestrictedPainting()] }),
          ],
          rendering: pdfRendering,
        }),
        query: createMockQuery({ canvas: 1 }),
      },
      userContext: { userIsStaffWithRestricted: true },
    });

    expect(downloadButton(container)).toBeInTheDocument();
  });

  it('hides the download button when there are no download options', () => {
    const { container } = renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas()],
        }),
        query: createMockQuery({ canvas: 1 }),
      },
    });

    expect(downloadButton(container)).not.toBeInTheDocument();
  });
});

describe('ViewerTopBar enhanced-mode gate', () => {
  it('renders neither the sidebar toggle nor the download when not enhanced', () => {
    const { container } = renderWithContext(
      <ViewerTopBar iiifImageLocation={undefined} />,
      {
        appContext: { isEnhanced: false, isFullSupportBrowser: true },
        contextProps: {
          transformedManifest: createMockManifest({
            canvases: [createMockCanvas()],
            rendering: pdfRendering,
          }),
          query: createMockQuery({ canvas: 1 }),
        },
      }
    );

    expect(screen.queryByText('Show info')).not.toBeInTheDocument();
    expect(screen.queryByText('Hide info')).not.toBeInTheDocument();
    expect(downloadButton(container)).not.toBeInTheDocument();
  });
});

describe('ViewerTopBar sidebar toggle labels', () => {
  it('labels the toggle "Hide info" when the desktop sidebar is active', () => {
    renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest(),
        isDesktopSidebarActive: true,
      },
    });

    expect(screen.getByText('Hide info')).toBeInTheDocument();
  });

  it('labels the toggle "Show info" when the desktop sidebar is inactive', () => {
    renderTopBar({
      contextProps: {
        transformedManifest: createMockManifest(),
        isDesktopSidebarActive: false,
      },
    });

    // Both the desktop (visually-hidden) and mobile toggles read "Show info".
    expect(screen.getAllByText('Show info').length).toBeGreaterThan(0);
  });
});
