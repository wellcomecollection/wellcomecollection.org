import { ComponentProps, FunctionComponent, ReactElement } from 'react';
import Layout, { gridSize12 } from '@weco/common/views/components/Layout';
import Divider from '@weco/common/views/components/Divider/Divider';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { EventBasic } from '@weco/content/types/events';
import { ArticleBasic } from '@weco/content/types/articles';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import Space from '@weco/common/views/components/styled/Space';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { SeriesBasic } from '@weco/content/types/series';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import { BookBasic } from '@weco/content/types/books';
import { Guide } from '@weco/content/types/guides';
import { ExhibitionGuideBasic } from '@weco/content/types/exhibition-guides';
import { pluralize } from '@weco/common/utils/grammar';
import Pagination from '@weco/content/components/Pagination/Pagination';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Breadcrumb from '@weco/common/views/components/Breadcrumb/Breadcrumb';

type PaginatedResultsTypes =
  | PaginatedResults<ExhibitionBasic>
  | PaginatedResults<EventBasic>
  | PaginatedResults<BookBasic>
  | PaginatedResults<ArticleBasic>
  | PaginatedResults<Guide>
  | PaginatedResults<ExhibitionGuideBasic>
  | PaginatedResults<SeriesBasic>;

type Props = {
  title: string;
  description?: string;
  paginatedResults: PaginatedResultsTypes;
  children?: ReactElement;
  breadcrumbs?: ComponentProps<typeof Breadcrumb>;
};

const LayoutPaginatedResults: FunctionComponent<Props> = ({
  title,
  description,
  paginatedResults,
  children,
  breadcrumbs = { items: [] },
}) => (
  <>
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={undefined}
      title={title}
      ContentTypeInfo={
        description && (
          <PrismicHtmlBlock
            html={[
              {
                type: 'paragraph',
                text: description,
                spans: [],
              },
            ]}
          />
        )
      }
      backgroundTexture={headerBackgroundLs}
      highlightHeading={true}
      isContentTypeInfoBeforeMedia={false}
    />
    {children}

    {paginatedResults.totalPages > 1 && (
      <Layout gridSizes={gridSize12()}>
        <PaginationWrapper $verticalSpacing="l">
          <span>{pluralize(paginatedResults.totalResults, 'result')}</span>

          <Pagination
            totalPages={paginatedResults.totalPages}
            ariaLabel="Results pagination"
            isHiddenMobile
          />
        </PaginationWrapper>

        <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
          <Divider />
        </Space>
      </Layout>
    )}

    <Space $v={{ size: 'l', properties: ['margin-top'] }}>
      {paginatedResults.results.length > 0 ? (
        <CardGrid items={paginatedResults.results} itemsPerRow={3} />
      ) : (
        <Layout gridSizes={gridSize12()}>
          <p>There are no results.</p>
        </Layout>
      )}
    </Space>

    {paginatedResults.totalPages > 1 && (
      <Layout gridSizes={gridSize12()}>
        <PaginationWrapper $verticalSpacing="l" $alignRight>
          <Pagination
            totalPages={paginatedResults.totalPages}
            ariaLabel="Results pagination"
          />
        </PaginationWrapper>
      </Layout>
    )}
  </>
);

export default LayoutPaginatedResults;
