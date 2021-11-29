import { GetServerSideProps } from 'next';
import { Book } from '@weco/common/model/books';
import { Fragment, FC } from 'react';
import { getBook } from '@weco/common/services/prismic/books';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { font, grid, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import BookImage from '@weco/common/views/components/BookImage/BookImage';
import styled from 'styled-components';
import {
  getGlobalContextData,
  WithGlobalContextData,
} from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import { AppErrorProps, WithGaDimensions } from '@weco/common/views/pages/_app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import Body from '../components/Body/Body';

const MetadataWrapper = styled.div`
  border-top: 1px solid ${props => props.theme.color('smoke')};
`;

type Props = {
  book: Book;
} & WithGlobalContextData &
  WithGaDimensions;

// FIXME: This is nonsense
type BookMetadataProps = { book: Book };
const BookMetadata = ({ book }: BookMetadataProps) => (
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

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const globalContextData = getGlobalContextData(context);
    const { id, memoizedPrismic } = context.query;
    const book: Book = await getBook(context.req, id, memoizedPrismic);

    if (book) {
      return {
        props: removeUndefinedProps({
          book,
          globalContextData,
          serverData,
          gaDimensions: {
            partOf: book.seasons.map(season => season.id),
          },
        }),
      };
    }

    return { notFound: true };
  };

const BookPage: FC<Props> = props => {
  if (!('book' in props)) return null;

  const { globalContextData, book } = props;
  const FeaturedMedia = book.cover && (
    <BookImage image={{ ...book.cover, sizesQueries: '' }} />
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
                [font('hnb', 3)]: true,
              })}
            >
              {book.subtitle}
            </p>
          )}
        </Fragment>
      }
      isContentTypeInfoBeforeMedia={true}
      HeroPicture={null}
      Background={null}
    />
  );

  return (
    <PageLayout
      title={book.title}
      description={book.metadataDescription || book.promoText || ''}
      url={{ pathname: `/books/${book.id}`, query: {} }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'book'}
      siteSection={null}
      imageUrl={book.image && convertImageUri(book.image.contentUrl, 800)}
      imageAltText={book.image && book.image.alt ? book.image.alt : undefined}
      globalContextData={globalContextData}
    >
      <ContentPage
        id={book.id}
        Header={Header}
        Body={<Body body={book.body} pageId={book.id} />}
        contributorProps={{ contributors: book.contributors }}
        seasons={book.seasons}
      >
        <Fragment>
          <MetadataWrapper>
            <BookMetadata book={book} />
          </MetadataWrapper>
          {book.orderLink && (
            <ButtonSolidLink link={book.orderLink} text="Buy the book" />
          )}
        </Fragment>
      </ContentPage>
    </PageLayout>
  );
};

export default BookPage;
