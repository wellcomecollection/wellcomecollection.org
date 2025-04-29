import { GetServerSideProps } from 'next';
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import { getServerData } from '@weco/common/server-data';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { Pageview } from '@weco/common/services/conversion/track';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import Button from '@weco/common/views/components/Buttons';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import Body from '@weco/content/components/Body';
import BookImage from '@weco/content/components/BookImage';
import ContentPage from '@weco/content/components/ContentPage';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchBook } from '@weco/content/services/prismic/fetch/books';
import { transformBook } from '@weco/content/services/prismic/transformers/books';
import { Book } from '@weco/content/types/books';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
const MetadataWrapper = styled.div`
  border-top: 1px solid ${props => props.theme.color('neutral.300')};
`;

const MetadataKey = styled(GridCell).attrs({
  as: 'dt',
})`
  margin: 0;
`;

const MetadataValue = styled(GridCell).attrs({
  as: 'dd',
})`
  margin: 0;
`;

type MetadataProps = {
  label: string;
  value: ReactElement | string | undefined;
};

const Metadata: FunctionComponent<MetadataProps> = ({ label, value }) => (
  <>
    <MetadataKey
      $sizeMap={{
        s: [4],
        m: [4],
        l: [4],
        xl: [4],
      }}
    >
      {label}
    </MetadataKey>
    <MetadataValue
      $sizeMap={{
        s: [8],
        m: [8],
        l: [8],
        xl: [8],
      }}
    >
      {value}
    </MetadataValue>
  </>
);

const BookMetadata: FunctionComponent<{ book: Book }> = ({ book }) => (
  <Space
    as="dl"
    $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}
  >
    <Grid>
      {book.datePublished && (
        <Metadata
          label="Date published"
          value={<HTMLDate date={book.datePublished} />}
        />
      )}
      <Metadata label="Format" value={book.format} />
      <Metadata label="Extent" value={book.extent} />
      <Metadata label="ISBN" value={book.isbn} />
    </Grid>
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

  if (isNotUndefined(bookDocument)) {
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
      <ContaineredLayout gridSizes={gridSize8()}>
        <BookImage
          image={{ ...book.cover }}
          sizes={{ xlarge: 1 / 3, large: 1 / 3, medium: 1 / 3, small: 1 }}
          quality="low"
        />
      </ContaineredLayout>
    </Space>
  );
  const breadcrumbs = {
    items: [
      {
        text: 'Books',
        url: '/books',
      },
      {
        url: linkResolver(book),
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
      url={{ pathname: `/books/${book.uid}` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="book"
      siteSection="stories"
      image={book.image}
      apiToolbarLinks={[createPrismicLink(book.id)]}
    >
      <ContentPage
        id={book.id}
        Header={Header}
        Body={
          <Body untransformedBody={book.untransformedBody} pageId={book.id} />
        }
        contributors={book.contributors}
        seasons={book.seasons}
      >
        <MetadataWrapper>
          <BookMetadata book={book} />
        </MetadataWrapper>
        {book.orderLink && (
          <Button
            variant="ButtonSolidLink"
            link={book.orderLink}
            text="Buy the book"
          />
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default BookPage;
