import { FunctionComponent, ReactElement } from 'react';
import * as prismicT from '@prismicio/types';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
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
import Pagination from '@weco/common/views/components/Pagination/Pagination';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';

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
  description?: prismicT.RichTextField;
  paginatedResults: PaginatedResultsTypes;
  children?: ReactElement;
};

const LayoutPaginatedResults: FunctionComponent<Props> = ({
  title,
  description,
  paginatedResults,
  children,
}) => (
  <>
    <PageHeader
      breadcrumbs={{ items: [] }}
      labels={undefined}
      title={title}
      ContentTypeInfo={description && <PrismicHtmlBlock html={description} />}
      backgroundTexture={headerBackgroundLs}
      highlightHeading={true}
      isContentTypeInfoBeforeMedia={false}
    />
    {children}

    {paginatedResults.totalPages > 1 && (
      <Layout12>
        <PaginationWrapper verticalSpacing="l">
          <span>{pluralize(paginatedResults.totalResults, 'result')}</span>

          <Pagination
            totalPages={paginatedResults.totalPages}
            ariaLabel="Results pagination"
            isHiddenMobile
          />
        </PaginationWrapper>

        <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
          <Divider />
        </Space>
      </Layout12>
    )}

    <Space v={{ size: 'l', properties: ['margin-top'] }}>
      {paginatedResults.results.length > 0 ? (
        <CardGrid items={paginatedResults.results} itemsPerRow={3} />
      ) : (
        <Layout12>
          <p>There are no results.</p>
        </Layout12>
      )}
    </Space>

    {paginatedResults.totalPages > 1 && (
      <Layout12>
        <PaginationWrapper verticalSpacing="l" alignRight>
          <Pagination
            totalPages={paginatedResults.totalPages}
            ariaLabel="Results pagination"
          />
        </PaginationWrapper>
      </Layout12>
    )}
  </>
);

export default LayoutPaginatedResults;
