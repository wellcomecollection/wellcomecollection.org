import { screen } from '@testing-library/react';

import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';
import { TransformedManifest } from '@weco/content/types/manifest';

import IIIFViewer from './IIIFViewer';

// IIIFViewer builds ItemViewerContext itself from props and the URL query, then
// renders the whole viewer tree. We stub the browser-only bits (openseadragon)
// and drive the URL via a mutable router query.
jest.mock('openseadragon', () => ({ __esModule: true, default: jest.fn() }));

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
};

const renderViewer = (transformedManifest: TransformedManifest) =>
  renderWithContext(
    <IIIFViewer
      work={mockWork}
      transformedManifest={transformedManifest}
      searchResults={null}
      setSearchResults={() => undefined}
    />,
    { appContext: { isEnhanced: true, isFullSupportBrowser: true } }
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
});
