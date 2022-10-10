import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Divider from '@weco/common/views/components/Divider/Divider';
import Pagination from '@weco/common/views/components/Pagination/Pagination';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { font } from '@weco/common/utils/classnames';
import { ExhibitionBasic } from '../../types/exhibitions';
import { EventBasic } from '../../types/events';
import { ArticleBasic } from '../../types/articles';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Space from '@weco/common/views/components/styled/Space';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { FC, ReactElement } from 'react';
import CardGrid from '../CardGrid/CardGrid';
import { BookBasic } from '../../types/books';
import { Guide } from '../../types/guides';
import * as prismicT from '@prismicio/types';
import { ExhibitionGuideBasic } from '../../types/exhibition-guides';
import {
  FreeAdmissionMessageWrapper,
  PaginationWrapper,
  ResultCountWrapper,
} from './LayoutPaginatedResults.styles';

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
  paginationRoot: string;
  paginatedResults: PaginatedResultsTypes;
  showFreeAdmissionMessage: boolean;
  children?: ReactElement;
};

const ResultCount: FC<{ paginatedResults: PaginatedResults<any> }> = ({
  paginatedResults,
}) => {
  const { pageSize, currentPage, totalPages, totalResults } = paginatedResults;

  return (
    <Layout12>
      <ResultCountWrapper>
        {pageSize * currentPage - (pageSize - 1)}
        {' – '}
        {currentPage < totalPages ? pageSize * currentPage : null}
        {currentPage === totalPages ? totalResults : null}
      </ResultCountWrapper>
      <Divider />
    </Layout12>
  );
};

const FreeAdmissionMessage: FC = () => (
  <FreeAdmissionMessageWrapper>
    <span className={font('intb', 4)}>Free admission</span>
  </FreeAdmissionMessageWrapper>
);

const LayoutPaginatedResults: FC<Props> = ({
  title,
  description,
  paginatedResults,
  paginationRoot,
  showFreeAdmissionMessage,
  children,
}) => (
  <>
    <SpacingSection>
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={undefined}
        title={title}
        ContentTypeInfo={description && <PrismicHtmlBlock html={description} />}
        Background={undefined}
        backgroundTexture={headerBackgroundLs}
        FeaturedMedia={undefined}
        HeroPicture={undefined}
        highlightHeading={true}
        isContentTypeInfoBeforeMedia={false}
      />
    </SpacingSection>
    {children}
    {paginatedResults.totalPages > 1 && (
      <ResultCount paginatedResults={paginatedResults} />
    )}
    {showFreeAdmissionMessage && <FreeAdmissionMessage />}

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
      <Space v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}>
        <PaginationWrapper>
          <Pagination
            paginatedResults={paginatedResults}
            paginationRoot={{
              href: {
                pathname: paginationRoot,
              },
              as: {
                pathname: paginationRoot,
              },
            }}
          />
        </PaginationWrapper>
      </Space>
    )}
  </>
);

export default LayoutPaginatedResults;
