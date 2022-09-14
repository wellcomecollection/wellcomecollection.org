import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Divider from '@weco/common/views/components/Divider/Divider';
import Pagination from '@weco/common/views/components/Pagination/Pagination';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { font } from '@weco/common/utils/classnames';
import { Period } from '../../types/periods';
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
  period?: Period;
  showFreeAdmissionMessage: boolean;
  children?: ReactElement;
};

const LayoutPaginatedResults: FC<Props> = ({
  title,
  description,
  paginatedResults,
  paginationRoot,
  period,
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
      <Layout12>
        <Space
          v={{
            size: 'l',
            properties: ['padding-bottom'],
          }}
          className={`flex flex--v-center font-pewter ${font('lr', 6)}`}
        >
          {paginatedResults.pageSize * paginatedResults.currentPage -
            (paginatedResults.pageSize - 1)}
          -
          {paginatedResults.currentPage < paginatedResults.totalPages
            ? paginatedResults.pageSize * paginatedResults.currentPage
            : null}
          {paginatedResults.currentPage === paginatedResults.totalPages
            ? paginatedResults.totalResults
            : null}
        </Space>
        <Divider color="pumice" isKeyline={true} />
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
        <Layout12>
          <div className="text-align-right">
            <Pagination
              total={paginatedResults.totalResults}
              currentPage={paginatedResults.currentPage}
              pageCount={paginatedResults.totalPages}
              prevPage={
                paginatedResults.currentPage > 1
                  ? paginatedResults.currentPage - 1
                  : undefined
              }
              nextPage={
                paginatedResults.currentPage < paginatedResults.totalPages
                  ? paginatedResults.currentPage + 1
                  : undefined
              }
              prevQueryString={
                `/${paginationRoot}` +
                (period ? `/${period}` : '') +
                (paginatedResults.currentPage > 1
                  ? `?page=${paginatedResults.currentPage - 1}`
                  : '')
              }
              nextQueryString={
                `/${paginationRoot}` +
                (period ? `/${period}` : '') +
                (paginatedResults.currentPage < paginatedResults.totalPages
                  ? `?page=${paginatedResults.currentPage + 1}`
                  : '')
              }
            />
          </div>
        </Layout12>
      </Space>
    )}
  </>
);

export default LayoutPaginatedResults;
