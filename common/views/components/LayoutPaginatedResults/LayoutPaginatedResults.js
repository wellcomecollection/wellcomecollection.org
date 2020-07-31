// @flow
import CardGrid from '../CardGrid/CardGrid';
import Layout12 from '../Layout12/Layout12';
import Layout from '../Layout/Layout';
import Divider from '../Divider/Divider';
import Pagination from '../Pagination/Pagination';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { classNames, font } from '../../../utils/classnames';
import type { Period } from '../../../model/periods';
import type { UiExhibition } from '../../../model/exhibitions';
import type { UiEvent } from '../../../model/events';
import type { Book } from '../../../model/books';
import type { Article } from '../../../model/articles';
import type {
  PaginatedResults,
  HTMLString,
} from '../../../services/prismic/types';
import SpacingSection from '../SpacingSection/SpacingSection';
import Space from '../styled/Space';
import PageHeader from '../PageHeader/PageHeader';
import WobblyEdge from '../WobblyEdge/WobblyEdge';

type PaginatedResultsTypes =
  | PaginatedResults<UiExhibition>
  | PaginatedResults<UiEvent>
  | PaginatedResults<Book>
  | PaginatedResults<Article>;

type Props = {|
  title: string,
  description: ?HTMLString,
  paginationRoot: string,
  paginatedResults: PaginatedResultsTypes,
  period?: Period,
  showFreeAdmissionMessage: boolean,
|};

const LayoutPaginatedResults = ({
  title,
  description,
  paginatedResults,
  paginationRoot,
  period,
  showFreeAdmissionMessage,
}: Props) => (
  <>
    <SpacingSection>
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={null}
        title={title}
        ContentTypeInfo={null}
        Background={null}
        backgroundTexture={`https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F43a35689-4923-4451-85d9-1ab866b1826d_event_header_background.svg`}
        FeaturedMedia={null}
        HeroPicture={null}
        highlightHeading={true}
      />
      <WobblyEdge background={'white'} />
    </SpacingSection>

    {description && (
      <Layout gridSizes={{ s: 12, m: 10, l: 8, xl: 8 }}>
        <div
          className={classNames({
            [font('hnm', 4)]: true,
          })}
        >
          <PrismicHtmlBlock html={description} />
        </div>
      </Layout>
    )}

    {paginatedResults.totalPages > 1 && (
      <Layout12>
        <Space
          v={{
            size: 'l',
            properties: ['padding-bottom'],
          }}
          className={classNames({
            flex: true,
            'flex--v-center': true,
            'font-pewter': true,
            [font('lr', 6)]: true,
          })}
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
        <Divider extraClasses={'divider--keyline divider--pumice'} />
      </Layout12>
    )}
    {showFreeAdmissionMessage && (
      <Layout12>
        <div className="flex-inline flex--v-center">
          <span
            className={classNames({
              [font('hnm', 4)]: true,
            })}
          >
            Free admission
          </span>
        </div>
      </Layout12>
    )}

    <Space v={{ size: 'l', properties: ['margin-top'] }}>
      <CardGrid items={paginatedResults.results} itemsPerRow={3} />
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
                  : null
              }
              nextPage={
                paginatedResults.currentPage < paginatedResults.totalPages
                  ? paginatedResults.currentPage + 1
                  : null
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
