import { screen } from '@testing-library/react';

import {
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
  createOpenPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';
import { installMockIntersectionObserver } from '@weco/content/test/fixtures/intersection-observer';
import {
  TransformedCanvas,
  TransformedManifest,
} from '@weco/content/types/manifest';

import IIIFCanvasThumbnail from './IIIFCanvasThumbnail';
import IIIFViewer from './IIIFViewer';

// Checks which canvases can ever reach IIIFCanvasThumbnail, whose placeholder
// icon is picked by canvas type (audio, video, pdf, file)
jest.mock('openseadragon', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('./IIIFCanvasThumbnail', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    replace: jest.fn(),
    pathname: '',
    asPath: '',
  }),
}));

installMockIntersectionObserver();
window.scrollTo = jest.fn();

const mockThumbnail = IIIFCanvasThumbnail as unknown as jest.Mock;

const mockWork: WorkBasic & Pick<Work, 'description'> = {
  id: 'abcd1234',
  title: 'A test work',
  workTypeId: undefined,
  description: undefined,
  shortDescription: undefined,
  languageId: undefined,
  thumbnail: undefined,
  referenceNumber: undefined,
  productionDates: [],
  archiveLabels: undefined,
  cardLabels: [],
  primaryContributorLabel: undefined,
  notes: [],
  physicalDescription: '',
  isArchiveCollectionRoot: false,
};

// A canvas with no thumbnail or image service, so IIIFCanvasThumbnail would
// fall back to its placeholder icon
const withoutThumbnail = (
  overrides: Partial<TransformedCanvas>
): TransformedCanvas =>
  createMockCanvas({
    thumbnailImage: undefined,
    imageServiceId: undefined,
    ...overrides,
  });

const imageCanvas = () =>
  createMockCanvas({ painting: [createOpenPainting()] });

const soundCanvas = () =>
  withoutThumbnail({
    painting: [createOpenPainting({ type: 'Sound', format: 'audio/mp3' })],
  });

const videoCanvas = () =>
  withoutThumbnail({
    painting: [createOpenPainting({ type: 'Video', format: 'video/mp4' })],
  });

const pdfCanvas = () =>
  withoutThumbnail({
    supplementing: [
      {
        id: 'https://example.com/file.pdf',
        type: 'Text',
        format: 'application/pdf',
      } as unknown as TransformedCanvas['supplementing'][number],
    ],
  });

const thumbnailCanvasesFor = (
  transformedManifest: TransformedManifest,
  isFullSupportBrowser: boolean
) => {
  mockThumbnail.mockClear();
  renderWithContext(
    <IIIFViewer
      work={mockWork}
      transformedManifest={transformedManifest}
      searchResults={null}
      setSearchResults={() => undefined}
    />,
    { appContext: { isEnhanced: true, isFullSupportBrowser } }
  );
  return mockThumbnail.mock.calls.map(
    ([props]) => (props as { canvas: TransformedCanvas }).canvas
  );
};

describe.each([true, false])(
  'IIIFViewer thumbnails (isFullSupportBrowser: %s)',
  isFullSupportBrowser => {
    it('renders thumbnails for an image-only manifest, including a canvas with no thumbnail', () => {
      const noThumb = withoutThumbnail({ painting: [createOpenPainting()] });
      const canvases = thumbnailCanvasesFor(
        createMockManifest({ canvases: [imageCanvas(), noThumb] }),
        isFullSupportBrowser
      );

      expect(canvases).toContain(noThumb);
    });

    it.each([
      ['Sound', soundCanvas],
      ['Video', videoCanvas],
      ['PDF', pdfCanvas],
    ])(
      'renders no thumbnails at all when a %s canvas is present',
      (_, make) => {
        const canvases = thumbnailCanvasesFor(
          createMockManifest({
            canvases: [imageCanvas(), make(), imageCanvas()],
          }),
          isFullSupportBrowser
        );

        expect(screen.getByTestId('topbar')).toBeInTheDocument();
        expect(canvases).toHaveLength(0);
      }
    );
  }
);
