import { NextPageContext } from 'next';
import { Book } from '@weco/common/model/books';
import { Fragment, Component, ReactElement } from 'react';
import { getBook } from '@weco/common/services/prismic/books';
import PageLayoutDeprecated from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Body from '@weco/common/views/components/Body/Body';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { defaultContributorImage } from '@weco/common/services/prismic/parsers';
import { font, grid, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import BookImage from '@weco/common/views/components/BookImage/BookImage';

type Props = {
  book: Book;
};

// FIXME: This is nonsense
const BookMetadata = ({ book }: Props) => (
  <Space
    v={{
      size: 'm',
      properties: ['margin-top', 'margin-bottom'],
    }}
    as="dl"
    className="grid"
  >
    {book.datePublished && (
      <Fragment>
        <dt className={'no-margin ' + grid({ s: 4, m: 4, l: 4, xl: 4 })}>
          Date published
        </dt>
        <dd className={'no-margin ' + grid({ s: 8, m: 8, l: 8, xl: 8 })}>
          {book.datePublished && (
            <HTMLDate date={new Date(book.datePublished)} />
          )}
        </dd>
      </Fragment>
    )}
    <dt className={'no-margin ' + grid({ s: 4, m: 4, l: 4, xl: 4 })}>Format</dt>
    <dd className={'no-margin ' + grid({ s: 8, m: 8, l: 8, xl: 8 })}>
      {book.format}
    </dd>

    <dt className={'no-margin ' + grid({ s: 4, m: 4, l: 4, xl: 4 })}>Extent</dt>
    <dd className={'no-margin ' + grid({ s: 8, m: 8, l: 8, xl: 8 })}>
      {book.extent}
    </dd>

    <dt className={'no-margin ' + grid({ s: 4, m: 4, l: 4, xl: 4 })}>ISBN</dt>
    <dd className={'no-margin ' + grid({ s: 8, m: 8, l: 8, xl: 8 })}>
      {book.isbn}
    </dd>
  </Space>
);

export class BookPage extends Component<Props | { statusCode: number }> {
  static getInitialProps = async (
    ctx: NextPageContext
  ): Promise<Props | { statusCode: number }> => {
    const { id, memoizedPrismic } = ctx.query;
    const book = await getBook(ctx.req, id, memoizedPrismic);

    if (book) {
      return { book };
    } else {
      return { statusCode: 404 };
    }
  };

  render(): ReactElement<Props> {
    if (!('book' in this.props)) return;

    const { book } = this.props;
    const FeaturedMedia = book.cover && (
      <BookImage image={{ ...book.cover, sizesQueries: null }} />
    );
    const breadcrumbs = {
      items: [
        {
          text: 'Books',
          url: '/books',
        },
        {
          url: `/books/${book.id}`,
          text: book.title,
          isHidden: true,
        },
      ],
    };
    const Header = (
      <PageHeader
        breadcrumbs={breadcrumbs}
        labels={null}
        title={book.title}
        FeaturedMedia={FeaturedMedia}
        ContentTypeInfo={
          <Fragment>
            {book.subtitle && (
              <p
                className={classNames({
                  'no-margin': true,
                  [font('hnm', 3)]: true,
                })}
              >
                {book.subtitle}
              </p>
            )}
            {book.authorName && <p className="no-margin">{book.authorName}</p>}
          </Fragment>
        }
        isContentTypeInfoBeforeMedia={true}
        HeroPicture={null}
        Background={null}
      />
    );

    // TODO: (drupal migration) we can drop reading the text fields once we've
    // migrated the content over
    const drupalPerson = book.authorName && {
      type: 'people',
      id: 'xxx',
      name: book.authorName || '',
      image: book.authorImage
        ? {
            contentUrl: book.authorImage || '',
            width: 800,
            height: 0,
            alt: `Image of ${book.authorName}`,
            tasl: {
              sourceName: 'Unknown',
              title: null,
              author: null,
              sourceLink: null,
              license: null,
              copyrightHolder: null,
              copyrightLink: null,
            },
            crops: {},
          }
        : defaultContributorImage,
      twitterHandle: null,
      // parse this as string
      description: book.authorDescription,
      sameAs: [],
    };
    const drupalContributor = drupalPerson && {
      contributor: drupalPerson,
      description: null,
      role: {
        id: 'WcUWeCgAAFws-nGh',
        title: 'Author',
        describedBy: 'words',
      },
    };
    const contributors =
      book.contributors.length > 0
        ? book.contributors
        : drupalContributor
        ? [drupalContributor]
        : [];

    return (
      <PageLayoutDeprecated
        title={book.title}
        description={book.metadataDescription || book.promoText || ''}
        url={{ pathname: `/books/${book.id}`, query: {} }}
        jsonLd={{ '@type': 'WebPage' }}
        openGraphType={'book'}
        siteSection={null}
        imageUrl={book.image && convertImageUri(book.image.contentUrl, 800)}
        imageAltText={book.image && book.image.alt}
      >
        <ContentPage
          id={book.id}
          Header={Header}
          Body={<Body body={book.body} pageId={book.id} />}
          contributorProps={{ contributors }}
        >
          <Fragment>
            <div className={`border-top-width-1 border-color-smoke`}>
              <BookMetadata book={book} />
            </div>
            {book.orderLink && (
              <ButtonSolidLink link={book.orderLink} text="Buy the book" />
            )}
          </Fragment>
        </ContentPage>
      </PageLayoutDeprecated>
    );
  }
}

export default BookPage;
