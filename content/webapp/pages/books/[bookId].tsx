import { GetServerSideProps } from 'next';
import { FunctionComponent, ReactElement } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import { font, grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import BookImage from '@weco/content/components/BookImage/BookImage';
import styled from 'styled-components';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/google-analytics';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import Body from '@weco/content/components/Body/Body';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import { fetchBook } from '@weco/content/services/prismic/fetch/books';
import { createClient } from '@weco/content/services/prismic/fetch';
import { transformBook } from '@weco/content/services/prismic/transformers/books';
import { Book } from '@weco/content/types/books';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import { Pageview } from '@weco/common/services/conversion/track';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

const MetadataWrapper = styled.div`
  border-top: 1px solid ${props => props.theme.color('neutral.300')};
`;

const MetadataKey = styled.dt.attrs({
  className: grid({ s: 4, m: 4, l: 4, xl: 4 }),
})`
  margin: 0;
`;

const MetadataValue = styled.dd.attrs({
  className: grid({ s: 8, m: 8, l: 8, xl: 8 }),
})`
  margin: 0;
`;

type MetadataProps = {
  label: string;
  value: ReactElement | string | undefined;
};

const Metadata: FunctionComponent<MetadataProps> = ({ label, value }) => (
  <>
    <MetadataKey>{label}</MetadataKey>
    <MetadataValue>{value}</MetadataValue>
  </>
);

const BookMetadata: FunctionComponent<{ book: Book }> = ({ book }) => (
  <Space
    $v={{
      size: 'm',
      properties: ['margin-top', 'margin-bottom'],
    }}
    as="dl"
    className="grid"
  >
    {book.datePublished && (
      <Metadata
        label="Date published"
        value={<HTMLDate date={book.datePublished} />}
      />
    )}
    <Metadata label="Format" value={book.format} />
    <Metadata label="Extent" value={book.extent} />
    <Metadata label="ISBN" value={book.isbn} />
  </Space>
);

const Subtitle = styled.p.attrs({
  className: font('intb', 3),
})`
  margin: 0;
`;

type Props = {
  book: Book;
  gaDimensions: GaDimensions;
  pageview: Pageview;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { bookId } = context.query;
  if (!looksLikePrismicId(bookId)) {
    return { notFound: true };
  }
  const client = createClient(context);
  const bookDocument = await fetchBook(client, bookId);

  if (bookDocument) {
    const serverData = await getServerData(context);
    const book = transformBook(bookDocument);

    return {
      props: serialiseProps({
        book,
        serverData,
        gaDimensions: {
          partOf: book.seasons.map(season => season.id),
        },
        pageview: {
          name: 'story',
          properties: { type: bookDocument.type },
        },
      }),
    };
  }

  return { notFound: true };
};

const BookPage: FunctionComponent<Props> = props => {
  if (!('book' in props)) return null;

  const { book } = props;
  const FeaturedMedia = book.cover && (
    <Space $v={{ size: 'xl', properties: ['margin-top', 'padding-top'] }}>
      <Layout8>
        <BookImage
          image={{ ...book.cover }}
          sizes={{ xlarge: 1 / 3, large: 1 / 3, medium: 1 / 3, small: 1 }}
          quality="low"
        />
      </Layout8>
    </Space>
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
      title={book.title}
      FeaturedMedia={FeaturedMedia}
      ContentTypeInfo={book.subtitle && <Subtitle>{book.subtitle}</Subtitle>}
      isContentTypeInfoBeforeMedia={true}
    />
  );

  return (
    <PageLayout
      title={book.title}
      description={book.metadataDescription || book.promo?.caption || ''}
      url={{ pathname: `/books/${book.id}` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="book"
      siteSection="stories"
      image={book.image}
      apiToolbarLinks={[createPrismicLink(book.id)]}
    >
      <ContentPage
        id={book.id}
        Header={Header}
        Body={<Body body={book.body} pageId={book.id} />}
        contributors={book.contributors}
        seasons={book.seasons}
      >
        <MetadataWrapper>
          <BookMetadata book={book} />
        </MetadataWrapper>
        {book.orderLink && (
          <ButtonSolidLink link={book.orderLink} text="Buy the book" />
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default BookPage;
