import { screen } from '@testing-library/react';

import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createRestrictedPainting,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';
import { TransformedCanvas } from '@weco/content/types/manifest';
import { TransformedAuthService } from '@weco/content/utils/iiif/v3';

import IIIFItem, { IIIFItemProps } from './index';

type RenderItemArgs = {
  item: IIIFItemProps;
  canvas?: TransformedCanvas;
  exclude?: Parameters<typeof IIIFItem>[0]['exclude'];
  externalAccessService?: TransformedAuthService;
  userIsStaffWithRestricted?: boolean;
};

const renderItem = ({
  item,
  canvas = createMockCanvas(),
  exclude = [],
  externalAccessService,
  userIsStaffWithRestricted = false,
}: RenderItemArgs) =>
  renderWithContext(
    <IIIFItem
      item={item}
      canvas={canvas}
      i={0}
      exclude={exclude}
      externalAccessService={externalAccessService}
    />,
    { userContext: { userIsStaffWithRestricted } }
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
