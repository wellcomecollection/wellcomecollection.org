import { FunctionComponent } from 'react';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { pluralize } from '@weco/common/utils/grammar';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import Divider from '@weco/common/views/components/Divider';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import CardGrid from '@weco/content/components/CardGrid';
import Pagination from '@weco/content/components/Pagination';
import { BookBasic } from '@weco/content/types/books';

export type Props = {
  books: PaginatedResults<BookBasic>;
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
