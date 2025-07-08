import { NextPage } from 'next';
import styled from 'styled-components';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import Button from '@weco/common/views/components/Buttons';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { Book } from '@weco/content/types/books';
import Body from '@weco/content/views/components/Body';
import BookImage from '@weco/content/views/components/BookImage';
import ContentPage from '@weco/content/views/components/ContentPage';

import BookMetadata from './book.Metadata';

const MetadataWrapper = styled.div`
  border-top: 1px solid ${props => props.theme.color('neutral.300')};
`;

const Subtitle = styled.p.attrs({
  className: font('intb', 3),
})`
  margin: 0;
`;

export type Props = {
  book: Book;
};

const BookPage: NextPage<Props> = props => {
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
