import { screen } from '@testing-library/react';

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

  it('shows the item for the current canvas when paginating to a later canvas', () => {
    const canvases = [
      createMockCanvas({
        painting: [
          {
            id: 'https://example.com/video-1.mp4',
            type: 'Video',
            format: 'video/mp4',
          },
        ] as never,
      }),
      createMockCanvas({
        painting: [
          {
            id: 'https://example.com/video-2.mp4',
            type: 'Video',
            format: 'video/mp4',
          },
        ] as never,
      }),
    ];

    const { container } = renderWithContext(<PaginatedItemViewer />, {
      contextProps: {
        transformedManifest: createMockManifest({ canvases }),
        query: createMockQuery({ canvas: 2 }),
        setShowFullscreenControl: jest.fn(),
      },
      useRefactoredContext: true,
    });

    expect(container.querySelector('source')).toHaveAttribute(
      'src',
      'https://example.com/video-2.mp4'
    );
  });

  it('renders a PDF item from the canvas originals', () => {
    const canvas = createMockCanvas({
      original: [
        {
          id: 'https://example.com/doc.pdf',
          type: 'Text',
          format: 'application/pdf',
          behavior: 'original',
        },
      ] as never,
    });

    renderWithContext(<PaginatedItemViewer />, {
      contextProps: {
        transformedManifest: createMockManifest({ canvases: [canvas] }),
        setShowFullscreenControl: jest.fn(),
      },
      useRefactoredContext: true,
    });

    expect(screen.getByRole('link', { name: /open/i })).toBeInTheDocument();
  });

  it('renders a download link for a born-digital archive item', () => {
    const canvas = createMockCanvas({
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
    });

    renderWithContext(<PaginatedItemViewer />, {
      contextProps: {
        transformedManifest: createMockManifest({ canvases: [canvas] }),
        setShowFullscreenControl: jest.fn(),
      },
      useRefactoredContext: true,
    });

    expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute(
      'href',
      'https://example.com/file.docx'
    );
  });

  it('passes the manifest access service through to restricted items', () => {
    const canvas = createMockCanvas({
      painting: [
        createRestrictedPainting({
          id: 'https://example.com/doc.pdf',
          type: 'Text',
          format: 'application/pdf',
        }),
      ],
    });

    renderWithContext(<PaginatedItemViewer />, {
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [canvas],
          auth: createMockAuth({
            externalAccessService: {
              id: 'https://example.com/access',
              label: 'Restricted access notice',
            },
          }),
        }),
        setShowFullscreenControl: jest.fn(),
      },
      useRefactoredContext: true,
    });

    expect(
      screen.getByRole('heading', { name: 'Restricted access notice' })
    ).toBeInTheDocument();
  });

  it('renders nothing when the current canvas cannot be resolved', () => {
    renderWithContext(<PaginatedItemViewer />, {
      contextProps: {
        transformedManifest: createMockManifest({
          canvases: [createMockCanvas()],
        }),
        query: createMockQuery({ canvas: 99 }),
        setShowFullscreenControl: jest.fn(),
      },
      useRefactoredContext: true,
    });

    expect(screen.getByTestId('main-viewer')).toBeEmptyDOMElement();
  });
});
