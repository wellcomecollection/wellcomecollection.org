import { screen, waitFor } from '@testing-library/react';

import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createRestrictedPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';
import { IIIFItemProps, TransformedCanvas } from '@weco/content/types/manifest';
import { TransformedAuthService } from '@weco/content/utils/iiif/v3';

import IIIFItem from './index';

type RenderItemArgs = {
  item: IIIFItemProps;
  canvas?: TransformedCanvas;
  exclude?: Parameters<typeof IIIFItem>[0]['exclude'];
  externalAccessService?: TransformedAuthService;
  userIsStaffWithRestricted?: boolean;
  isKiosk?: boolean;
  accessToken?: string;
};

const renderItem = ({
  item,
  canvas = createMockCanvas(),
  exclude = [],
  externalAccessService,
  userIsStaffWithRestricted = false,
  isKiosk = false,
  accessToken,
}: RenderItemArgs) =>
  renderWithContext(
    <IIIFItem
      item={item}
      canvas={canvas}
      i={0}
      exclude={exclude}
      externalAccessService={externalAccessService}
    />,
    {
      userContext: { userIsStaffWithRestricted },
      kioskContext: { isKiosk },
      contextProps: { accessToken },
    }
  );

describe('IIIFItem restricted access', () => {
  it('shows the public restricted message (not the item) for a restricted canvas and a non-staff user', () => {
    renderItem({
      item: {
        id: 'https://example.com/doc.pdf',
        type: 'Text',
        format: 'application/pdf',
      } as IIIFItemProps,
      canvas: createMockCanvas({ painting: [createRestrictedPainting()] }),
      userIsStaffWithRestricted: false,
    });

    // The public restricted message links to the collections mailbox.
    expect(
      screen.getByRole('link', { name: 'collections@wellcomecollection.org' })
    ).toBeInTheDocument();
    // ...and the underlying item (the PDF "Open" link) is not rendered.
    expect(
      screen.queryByRole('link', { name: /open/i })
    ).not.toBeInTheDocument();
  });

  it('rewrites "image"/"viewed" to "item"/"accessed" in the access-service note for a non-image item', () => {
    renderItem({
      item: {
        id: 'https://example.com/doc.pdf',
        type: 'Text',
        format: 'application/pdf',
      } as IIIFItemProps,
      canvas: createMockCanvas({ painting: [createRestrictedPainting()] }),
      externalAccessService: {
        id: 'https://example.com/access',
        description: 'This image can be viewed on site.',
      },
      userIsStaffWithRestricted: false,
    });

    expect(
      screen.getByText('This item can be accessed on site.')
    ).toBeInTheDocument();
  });

  it('also rewrites the access-service note for a born-digital image with originals (not just non-image types)', () => {
    renderItem({
      item: {
        id: 'https://example.com/placeholder',
        type: 'Image',
      } as IIIFItemProps,
      canvas: createMockCanvas({
        painting: [createRestrictedPainting()],
        original: [
          {
            id: 'https://example.com/file.docx',
            format: 'application/msword',
            behavior: 'original',
          },
        ] as never,
      }),
      externalAccessService: {
        id: 'https://example.com/access',
        description: 'This image can be viewed on site.',
      },
      userIsStaffWithRestricted: false,
    });

    expect(
      screen.getByText('This item can be accessed on site.')
    ).toBeInTheDocument();
  });

  it('shows the item to a staff user with a valid access token when the canvas has no probe service to check', async () => {
    renderItem({
      item: {
        id: 'https://example.com/doc.pdf',
        type: 'Text',
        format: 'application/pdf',
      } as IIIFItemProps,
      canvas: createMockCanvas({
        painting: [createRestrictedPainting()],
        probeServiceId: undefined,
      }),
      userIsStaffWithRestricted: true,
      accessToken: 'test-token',
    });

    await waitFor(() =>
      expect(screen.getByRole('link', { name: /open/i })).toBeInTheDocument()
    );
  });

  it('keeps the item hidden from a staff user with no access token yet (the probe never runs)', () => {
    renderItem({
      item: {
        id: 'https://example.com/doc.pdf',
        type: 'Text',
        format: 'application/pdf',
      } as IIIFItemProps,
      canvas: createMockCanvas({ painting: [createRestrictedPainting()] }),
      userIsStaffWithRestricted: true,
    });

    expect(
      screen.queryByRole('link', { name: /open/i })
    ).not.toBeInTheDocument();
  });
});

describe('IIIFItem type dispatch', () => {
  it('renders a download for a born-digital image (canvas with original files)', () => {
    renderItem({
      item: {
        id: 'https://example.com/placeholder',
        type: 'Image',
      } as IIIFItemProps,
      canvas: createMockCanvas({
        original: [
          {
            id: 'https://example.com/file.docx',
            format: 'application/msword',
            behavior: 'original',
          },
        ] as never,
      }),
    });

    expect(screen.getByRole('link', { name: /download/i })).toBeInTheDocument();
  });

  it('renders a distinct download link for each original file when there are several', () => {
    renderItem({
      item: {
        id: 'https://example.com/placeholder',
        type: 'Image',
      } as IIIFItemProps,
      canvas: createMockCanvas({
        original: [
          {
            id: 'https://example.com/file-1.docx',
            format: 'application/msword',
            behavior: 'original',
          },
          {
            id: 'https://example.com/file-2.docx',
            format: 'application/msword',
            behavior: 'original',
          },
        ] as never,
      }),
    });

    const downloadLinks = screen.getAllByRole('link', { name: /download/i });
    expect(downloadLinks.map(link => link.getAttribute('href'))).toEqual([
      'https://example.com/file-1.docx',
      'https://example.com/file-2.docx',
    ]);
  });

  it('renders the "Open" link for a PDF item', () => {
    renderItem({
      item: {
        id: 'https://example.com/doc.pdf',
        type: 'Text',
        format: 'application/pdf',
      } as IIIFItemProps,
    });

    expect(screen.getByRole('link', { name: /open/i })).toBeInTheDocument();
  });

  it('renders a video player for a Video item', () => {
    const { container } = renderItem({
      item: {
        id: 'https://example.com/video.mp4',
        type: 'Video',
        format: 'video/mp4',
      } as IIIFItemProps,
    });

    expect(
      container.querySelector('[data-component="video-player"]')
    ).toBeInTheDocument();
  });

  it('renders an audio player for a Sound item', () => {
    const { container } = renderItem({
      item: {
        id: 'https://example.com/audio.mp3',
        type: 'Sound',
        format: 'audio/mpeg',
      } as IIIFItemProps,
    });

    expect(
      container.querySelector('[data-component="audio-player"]')
    ).toBeInTheDocument();
  });

  it('recurses into the first item of a Choice item', () => {
    renderItem({
      item: {
        type: 'Choice',
        items: [
          {
            id: 'https://example.com/doc.pdf',
            type: 'Text',
            format: 'application/pdf',
          },
        ],
      } as unknown as IIIFItemProps,
    });

    expect(screen.getByRole('link', { name: /open/i })).toBeInTheDocument();
  });

  it('renders nothing for a Choice item whose first item is a bare string reference', () => {
    const { container } = renderItem({
      item: {
        type: 'Choice',
        items: ['https://example.com/doc.pdf'],
      } as unknown as IIIFItemProps,
    });

    expect(container).toBeEmptyDOMElement();
  });

  it('falls back to a plain <img> for an Image item with no image service', () => {
    renderItem({
      item: {
        id: 'https://example.com/plain-image.jpg',
        type: 'Image',
      } as IIIFItemProps,
    });

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://example.com/plain-image.jpg'
    );
  });

  it('renders the unavailable-content message for an unhandled type', () => {
    renderItem({
      item: {
        id: 'https://example.com/data',
        type: 'Dataset',
      } as IIIFItemProps,
    });

    expect(
      screen.getByText('We are working to make this content available online.')
    ).toBeInTheDocument();
  });

  it('renders nothing when the item type is excluded', () => {
    const { container } = renderItem({
      item: {
        id: 'https://example.com/data',
        type: 'Dataset',
      } as IIIFItemProps,
      exclude: ['Dataset'],
    });

    expect(container).toBeEmptyDOMElement();
  });
});

describe('IIIFItem kiosk mode', () => {
  it('hides download button in kiosk mode for born-digital items', () => {
    renderItem({
      item: {
        id: 'https://example.com/placeholder',
        type: 'Image',
      } as IIIFItemProps,
      canvas: createMockCanvas({
        original: [
          {
            id: 'https://example.com/file.docx',
            format: 'application/msword',
            behavior: 'original',
          },
        ] as never,
      }),
      isKiosk: true,
    });

    expect(
      screen.queryByRole('link', { name: /download/i })
    ).not.toBeInTheDocument();
  });

  it('hides download button in kiosk mode for PDF items', () => {
    renderItem({
      item: {
        id: 'https://example.com/doc.pdf',
        type: 'Text',
        format: 'application/pdf',
      } as IIIFItemProps,
      isKiosk: true,
    });

    expect(
      screen.queryByRole('link', { name: /open/i })
    ).not.toBeInTheDocument();
  });

  it('hides born digital warning in kiosk mode for files on items page', () => {
    renderItem({
      item: {
        id: 'https://example.com/placeholder',
        type: 'Image',
      } as IIIFItemProps,
      canvas: createMockCanvas({
        original: [
          {
            id: 'https://example.com/file.docx',
            format: 'application/msword',
            behavior: 'original',
          },
        ] as never,
      }),
      isKiosk: true,
    });

    expect(screen.queryByText(/born digital/i)).not.toBeInTheDocument();
  });
});
