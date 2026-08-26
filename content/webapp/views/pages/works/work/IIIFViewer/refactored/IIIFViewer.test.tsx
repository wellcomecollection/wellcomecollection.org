import { fireEvent, screen } from '@testing-library/react';

import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import {
  renderWithContext,
  RenderWithContextOptions,
} from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
  createOpenPainting,
  createRestrictedPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';
import { installMockIntersectionObserver } from '@weco/content/test/fixtures/intersection-observer';
import { TransformedManifest } from '@weco/content/types/manifest';

import IIIFViewer from './IIIFViewer';

// IIIFViewer builds ItemViewerContext itself from props and the URL query, then
// renders the whole viewer tree. We stub the browser-only bits (openseadragon)
// and drive the URL via a mutable router query.
jest.mock('openseadragon', () => ({ __esModule: true, default: jest.fn() }));

// The refactored IIIFViewer provides values via ItemViewerContextRefactored, so
// useItemViewerContext must read from that context. It checks the feature flag
// to decide which context to use, so we mock it to return the refactored flag.
jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ itemViewerRefactor: true }),
}));

installMockIntersectionObserver();

// GridViewer schedules a window.scrollTo(0, 0) 700ms after mount, which lands
// while a later test in this file is still running. jsdom doesn't implement
// scrollTo, so leaving it unstubbed fills the run with "Not implemented"
// errors that have nothing to do with what's being asserted.
window.scrollTo = jest.fn();

// Must be prefixed `mock` to be referenced inside the hoisted jest.mock factory.
let mockRouterQuery: Record<string, string> = {};
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: mockRouterQuery,
    replace: jest.fn(),
    pathname: '',
    asPath: '',
  }),
}));

const mockWork: WorkBasic & Pick<Work, 'description'> = {
  id: 'abcd1234',
  title: 'A test work',
  workTypeId: undefined,
  description: undefined,
  languageId: undefined,
  thumbnail: undefined,
  referenceNumber: undefined,
  productionDates: [],
  archiveLabels: undefined,
  cardLabels: [],
  primaryContributorLabel: undefined,
  notes: [],
  physicalDescription: '',
  isRootCollection: false,
  isArchive: false,
};

const renderViewer = (
  transformedManifest: TransformedManifest,
  options: RenderWithContextOptions = {}
) =>
  renderWithContext(
    <IIIFViewer
      work={mockWork}
      transformedManifest={transformedManifest}
      searchResults={null}
      setSearchResults={() => undefined}
    />,
    {
      appContext: { isEnhanced: true, isFullSupportBrowser: true },
      ...options,
    }
  );

beforeEach(() => {
  mockRouterQuery = {};
});

describe('IIIFViewer', () => {
  it('renders the top bar for a multi-canvas image manifest', () => {
    renderViewer(
      createMockManifest({
        canvases: [createMockCanvas(), createMockCanvas()],
      })
    );

    expect(screen.getByTestId('topbar')).toBeInTheDocument();
  });

  it('reflects the canvas URL param in the page indicator', async () => {
    mockRouterQuery = { canvas: '2', manifest: '1' };

    renderViewer(
      createMockManifest({
        canvases: [
          createMockCanvas({ label: '1' }),
          createMockCanvas({ label: '2' }),
          createMockCanvas({ label: '3' }),
        ],
      })
    );

    // IIIFViewer sets isResizing on mount and clears it after a debounce; the
    // page indicator only renders once resizing settles.
    expect(await screen.findByTestId('active-index')).toHaveTextContent('2');
    expect(screen.getByTestId('topbar')).toHaveTextContent('/3');
  });

  it('renders no page indicator for a single-canvas manifest', () => {
    renderViewer(
      createMockManifest({ canvases: [createMockCanvas({ label: '1' })] })
    );

    expect(screen.queryByTestId('active-index')).not.toBeInTheDocument();
  });

  // These exercise the real IIIFViewer -> context -> ViewerTopBar wiring for
  // isCurrentCanvasRestricted, rather than ViewerTopBar.test.tsx's mocked
  // context value (which derives the flag independently in the test fixture,
  // and so wouldn't catch IIIFViewer deriving it from the wrong canvas or
  // failing to put it on the provider).
  describe('restricted current canvas', () => {
    // A manifest-level rendering, so there are download options to hide.
    const pdfRendering: TransformedManifest['rendering'] = [
      {
        id: 'https://example.com/whole.pdf',
        type: 'Text',
        format: 'application/pdf',
      },
    ];

    // Only the second canvas is restricted, so a check against the wrong
    // canvas (the first, say) gives the wrong answer for both cases below.
    const mixedRestrictionManifest = createMockManifest({
      canvases: [
        createMockCanvas({
          id: 'https://example.com/canvases/open',
          painting: [createOpenPainting()],
        }),
        createMockCanvas({
          id: 'https://example.com/canvases/restricted',
          painting: [createRestrictedPainting()],
        }),
      ],
      rendering: pdfRendering,
    });

    const downloadButton = (container: HTMLElement) =>
      container.querySelector('[data-component="download-button"]');

    it('hides the download button when the canvas in the URL is restricted', () => {
      mockRouterQuery = { canvas: '2', manifest: '1' };

      const { container } = renderViewer(mixedRestrictionManifest);

      expect(downloadButton(container)).not.toBeInTheDocument();
    });

    it('shows the download button when the canvas in the URL is unrestricted', () => {
      mockRouterQuery = { canvas: '1', manifest: '1' };

      const { container } = renderViewer(mixedRestrictionManifest);

      expect(downloadButton(container)).toBeInTheDocument();
    });

    it('shows the download button on a restricted canvas for a StaffWithRestricted user', () => {
      mockRouterQuery = { canvas: '2', manifest: '1' };

      const { container } = renderViewer(mixedRestrictionManifest, {
        userContext: { userIsStaffWithRestricted: true },
      });

      expect(downloadButton(container)).toBeInTheDocument();
    });
  });

  // These exercise the real IIIFViewer -> context -> ZoomedImage wiring for
  // mainImageService, rather than ZoomedImage.test.tsx's mocked context value
  // (which derives mainImageService independently in the test fixture and so
  // wouldn't catch a break in IIIFViewer's own derivation/provider wiring).
  describe('zoomed image', () => {
    const originalFetch = global.fetch;
    let fetchMock: jest.Mock;

    beforeEach(() => {
      // Never resolves - we only care which URL it's called with (or whether
      // it's called at all), and letting the promise settle would require
      // also faking openseadragon's viewer shape.
      fetchMock = jest.fn(() => new Promise(() => undefined));
      global.fetch = fetchMock as unknown as typeof fetch;
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it("fetches the info.json for the current canvas's image service when zoomed in", async () => {
      renderViewer(
        createMockManifest({
          canvases: [
            createMockCanvas({
              imageServiceId:
                'https://iiif.wellcomecollection.org/image/b0001.jp2',
            }),
          ],
        })
      );

      fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));

      expect(await screen.findByTestId('zoomed-image')).toBeInTheDocument();
      expect(fetchMock).toHaveBeenCalledWith(
        'https://iiif.wellcomecollection.org/image/b0001.jp2/info.json'
      );
    });

    it('does not fetch, and does not crash, when the current canvas has no image service', async () => {
      renderViewer(
        createMockManifest({
          canvases: [createMockCanvas({ imageServiceId: undefined })],
        })
      );

      fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));

      expect(await screen.findByTestId('zoomed-image')).toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
