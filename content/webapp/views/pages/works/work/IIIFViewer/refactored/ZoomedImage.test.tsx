import { ItemViewerContextProps } from '@weco/content/contexts/ItemViewerContext/refactored';
import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
  createMockQuery,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import ZoomedImage from './ZoomedImage';

// The refactored components read from ItemViewerContextRefactored via the
// useItemViewerContext hook, which checks the feature flag. Mock it so the
// hook returns the refactored context values.
jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ itemViewerRefactor: true }),
}));

// ZoomedImage only constructs an openseadragon viewer once its info.json
// fetch resolves; leaving fetch pending below means it's never called, so a
// shallow mock is enough to satisfy the import.
jest.mock('openseadragon', () => ({ __esModule: true, default: jest.fn() }));

const renderZoomedImage = (
  contextProps: Partial<ItemViewerContextProps> = {}
) =>
  renderWithContext(<ZoomedImage iiifImageLocation={undefined} />, {
    contextProps,
    useRefactoredContext: true,
  });

describe('ZoomedImage', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    // Never resolves - we only care which URL it's called with, and letting
    // the promise settle would require also faking openseadragon's viewer shape.
    fetchMock = jest.fn(() => new Promise(() => undefined));
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('renders the zoomed image container', () => {
    const { container } = renderZoomedImage({
      transformedManifest: createMockManifest(),
    });

    expect(
      container.querySelector('#image-viewer-zoomedImage')
    ).toBeInTheDocument();
  });

  it('fetches the info.json for the canvas in the correct structural position, not just its array position', () => {
    const canvasA = createMockCanvas({
      id: 'a',
      imageServiceId: 'https://iiif.wellcomecollection.org/image/canvas-a.jp2',
    });
    const canvasB = createMockCanvas({
      id: 'b',
      imageServiceId: 'https://iiif.wellcomecollection.org/image/canvas-b.jp2',
    });

    renderZoomedImage({
      // Array order is [a, b], but the structure displays b before a - so
      // canvas 1 should resolve to canvasB, not canvasA.
      transformedManifest: createMockManifest({
        canvases: [canvasA, canvasB],
      }),
      canvasIndexById: { b: 1, a: 2 },
      query: createMockQuery({ canvas: 1 }),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://iiif.wellcomecollection.org/image/canvas-b.jp2/info.json'
    );
  });
});
