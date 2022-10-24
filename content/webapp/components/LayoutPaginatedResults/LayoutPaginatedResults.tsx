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
import { FunctionComponent, ReactElement } from 'react';
import CardGrid from '../CardGrid/CardGrid';
import { BookBasic } from '../../types/books';
import { Guide } from '../../types/guides';
import * as prismicT from '@prismicio/types';
import { ExhibitionGuideBasic } from '../../types/exhibition-guides';
import styled from 'styled-components';

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

const PaginationWrapper = styled(Layout12)`
  text-align: right;
`;

const TotalPagesCopy = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-bottom'] },
  className: font('lr', 6),
})`
  display: flex;
  align-items: center;
  color: ${props => props.theme.color('neutral.600')};
`;

const LayoutPaginatedResults: FunctionComponent<Props> = ({
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
        backgroundTexture={headerBackgroundLs}
        highlightHeading={true}
        isContentTypeInfoBeforeMedia={false}
      />
    </SpacingSection>
    {children}
    {paginatedResults.totalPages > 1 && (
      <Layout12>
        <TotalPagesCopy>
          {paginatedResults.pageSize * paginatedResults.currentPage -
            (paginatedResults.pageSize - 1)}
          -
          {paginatedResults.currentPage < paginatedResults.totalPages
            ? paginatedResults.pageSize * paginatedResults.currentPage
            : null}
          {paginatedResults.currentPage === paginatedResults.totalPages
            ? paginatedResults.totalResults
            : null}
        </TotalPagesCopy>
        <Divider />
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
