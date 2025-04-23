import type { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { pluralize } from '@weco/common/utils/grammar';
import { serialiseProps } from '@weco/common/utils/json';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb/Breadcrumb';
import Divider from '@weco/common/views/components/Divider/Divider';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import Pagination from '@weco/content/components/Pagination/Pagination';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchBooks } from '@weco/content/services/prismic/fetch/books';
import {
  transformBook,
  transformBookToBookBasic,
} from '@weco/content/services/prismic/transformers/books';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { BookBasic } from '@weco/content/types/books';
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

type Props = {
  books: PaginatedResults<BookBasic>;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const page = getPage(context.query);
  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const client = createClient(context);
  const booksQuery = await fetchBooks(client, {
    page,
    pageSize: 21,
  });

  const books = transformQuery(booksQuery, book =>
    transformBookToBookBasic(transformBook(book))
  );

  const serverData = await getServerData(context);

  return {
    props: serialiseProps({
      books,
      serverData,
    }),
  };
};

const BooksPage: FunctionComponent<Props> = ({ books }) => {
  const firstBook = books.results[0];

  return (
    <PageLayout
      title="Books"
      description={pageDescriptions.books}
      url={{ pathname: '/books' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="stories"
      image={firstBook && firstBook.cover}
    >
      <SpacingSection>
        <PageHeader
          breadcrumbs={getBreadcrumbItems('stories')}
          title="Books"
          ContentTypeInfo={
            pageDescriptions.books && (
              <PrismicHtmlBlock
                html={[
                  {
                    type: 'paragraph',
                    text: pageDescriptions.books,
                    spans: [],
                  },
                ]}
              />
            )
          }
          backgroundTexture={headerBackgroundLs}
          highlightHeading={true}
        />

        {books.totalPages > 1 && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="l">
              <span>{pluralize(books.totalResults, 'result')}</span>

              <Pagination
                totalPages={books.totalPages}
                ariaLabel="Results pagination"
                isHiddenMobile
              />
            </PaginationWrapper>

            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              <Divider />
            </Space>
          </ContaineredLayout>
        )}

        <Space $v={{ size: 'l', properties: ['margin-top'] }}>
          {books.results.length > 0 ? (
            <CardGrid items={books.results} itemsPerRow={3} />
          ) : (
            <ContaineredLayout gridSizes={gridSize12()}>
              <p>There are no results.</p>
            </ContaineredLayout>
          )}
        </Space>

        {books.totalPages > 1 && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="l" $alignRight>
              <Pagination
                totalPages={books.totalPages}
                ariaLabel="Results pagination"
              />
            </PaginationWrapper>
          </ContaineredLayout>
        )}
      </SpacingSection>
    </PageLayout>
  );
};

export default BooksPage;
