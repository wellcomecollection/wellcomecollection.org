import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import * as prismicT from '@prismicio/types';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Divider from '@weco/common/views/components/Divider/Divider';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { font } from '@weco/common/utils/classnames';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { EventBasic } from '@weco/content/types/events';
import { ArticleBasic } from '@weco/content/types/articles';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import Space from '@weco/common/views/components/styled/Space';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import { BookBasic } from '@weco/content/types/books';
import { Guide } from '@weco/content/types/guides';
import { ExhibitionGuideBasic } from '@weco/content/types/exhibition-guides';
import { pluralize } from '@weco/common/utils/grammar';
import SearchPagination from '@weco/common/views/components/SearchPagination/SearchPagination';

type PaginatedResultsTypes =
  | PaginatedResults<ExhibitionBasic>
  | PaginatedResults<EventBasic>
  | PaginatedResults<BookBasic>
  | PaginatedResults<ArticleBasic>
  | PaginatedResults<Guide>
  | PaginatedResults<ExhibitionGuideBasic>;

type Props = {
  title: string;
  description?: prismicT.RichTextField;
  paginatedResults: PaginatedResultsTypes;
  showFreeAdmissionMessage: boolean;
  children?: ReactElement;
};

type ResultsPaginationProps = {
  totalResults: number;
  totalPages: number;
  isHiddenMobile?: boolean;
};

const PaginationWrapper = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: font('intb', 5),
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const ResultsPagination = ({
  totalResults,
  totalPages,
  isHiddenMobile,
}: ResultsPaginationProps) => (
  <PaginationWrapper>
    <span>{pluralize(totalResults, 'result')}</span>

    <SearchPagination totalPages={totalPages} isHiddenMobile={isHiddenMobile} />
  </PaginationWrapper>
);

const LayoutPaginatedResults: FunctionComponent<Props> = ({
  title,
  description,
  paginatedResults,
  showFreeAdmissionMessage,
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
        <ResultsPagination
          totalResults={paginatedResults.totalResults}
          totalPages={paginatedResults.totalPages}
          isHiddenMobile
        />
        <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
          <Divider />
        </Space>
      </Layout12>
    )}
    {showFreeAdmissionMessage && (
      <Layout12>
        <div className="flex-inline flex--v-center">
          <span className={font('intb', 4)}>Free admission</span>
        </div>
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
        <ResultsPagination
          totalResults={paginatedResults.totalResults}
          totalPages={paginatedResults.totalPages}
        />
      </Layout12>
    )}
  </>
);

export default LayoutPaginatedResults;
