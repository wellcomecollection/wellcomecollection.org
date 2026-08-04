import { screen } from '@testing-library/react';

import { ItemViewerContextProps } from '@weco/content/contexts/ItemViewerContext/refactored';
import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockAuth,
  createMockCanvas,
  createMockManifest,
  createMockQuery,
  createRestrictedPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import PaginatedItemViewer from './PaginatedItemViewer';

// The refactored components read from ItemViewerContextRefactored via the
// useItemViewerContext hook, which checks the feature flag. Mock it so the
// hook returns the refactored context values.
jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ itemViewerRefactor: true }),
}));

const createVideoCanvas = (id = 'https://example.com/video.mp4') =>
  createMockCanvas({
    painting: [{ id, type: 'Video', format: 'video/mp4' }] as never,
  });

const renderViewer = (contextProps: Partial<ItemViewerContextProps> = {}) =>
  renderWithContext(<PaginatedItemViewer />, {
    contextProps,
    useRefactoredContext: true,
  });

describe('PaginatedItemViewer', () => {
  it('renders the current item', () => {
    const { container } = renderViewer({
      transformedManifest: createMockManifest({
        canvases: [createVideoCanvas()],
      }),
    });

    expect(
      container.querySelector('[data-component="video-player"]')
    ).toBeInTheDocument();
  });

  it('hides the fullscreen control, since the paginated viewer never supports it', () => {
    const setShowFullscreenControl = jest.fn();

    renderViewer({
      transformedManifest: createMockManifest({
        canvases: [createVideoCanvas()],
      }),
      setShowFullscreenControl,
    });

    expect(setShowFullscreenControl).toHaveBeenCalledWith(false);
  });

  it('renders the item for the canvas number associated with the query', () => {
    const { container } = renderViewer({
      transformedManifest: createMockManifest({
        canvases: [
          createVideoCanvas('https://example.com/video-1.mp4'),
          createVideoCanvas('https://example.com/video-2.mp4'),
        ],
      }),
      query: createMockQuery({ canvas: 2 }),
    });

    expect(container.querySelector('source')).toHaveAttribute(
      'src',
      'https://example.com/video-2.mp4'
    );
  });

  it('renders a PDF item from the canvas originals', () => {
    renderViewer({
      transformedManifest: createMockManifest({
        canvases: [
          createMockCanvas({
            original: [
              {
                id: 'https://example.com/doc.pdf',
                type: 'Text',
                format: 'application/pdf',
                behavior: 'original',
              },
            ] as never,
          }),
        ],
      }),
    });

    expect(screen.getByRole('link', { name: /open/i })).toBeInTheDocument();
  });

  it('renders a download link for a born-digital archive item', () => {
    renderViewer({
      transformedManifest: createMockManifest({
        canvases: [
          createMockCanvas({
            painting: [
              { id: 'https://example.com/placeholder', type: 'Image' },
            ] as never,
            original: [
              {
                id: 'https://example.com/file.docx',
                format: 'application/msword',
                behavior: 'original',
              },
            ] as never,
          }),
        ],
      }),
    });

    expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute(
      'href',
      'https://example.com/file.docx'
    );
  });

  it('passes the manifest access service through to restricted items', () => {
    renderViewer({
      transformedManifest: createMockManifest({
        canvases: [
          createMockCanvas({
            painting: [
              createRestrictedPainting({
                id: 'https://example.com/doc.pdf',
                type: 'Text',
                format: 'application/pdf',
              }),
            ],
          }),
        ],
        auth: createMockAuth({
          externalAccessService: {
            id: 'https://example.com/access',
            label: 'Restricted access notice',
          },
        }),
      }),
    });

    expect(
      screen.getByRole('heading', { name: 'Restricted access notice' })
    ).toBeInTheDocument();
  });

  it('renders nothing when the current canvas cannot be resolved', () => {
    const { container } = renderViewer({
      transformedManifest: createMockManifest({
        canvases: [createMockCanvas()],
      }),
      query: createMockQuery({ canvas: 99 }),
    });

    // The wrapping container belongs to the MainViewer router, so returning
    // null leaves nothing of ours in the DOM at all.
    expect(container).toBeEmptyDOMElement();
  });
});
