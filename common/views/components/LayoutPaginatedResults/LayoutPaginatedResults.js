// @flow
import { Fragment } from 'react';
import CardGrid from '../CardGrid/CardGrid';
import Layout12 from '../Layout12/Layout12';
import Divider from '../Divider/Divider';
import Pagination from '../Pagination/Pagination';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { classNames, font, grid } from '../../../utils/classnames';
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
import VerticalSpace from '../styled/VerticalSpace';

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
  <Fragment>
    <SpacingSection>
      <VerticalSpace
        v={{
          size: 'l',
          properties: ['padding-top', 'padding-bottom'],
        }}
        className={classNames({
          row: true,
          'bg-cream': true,
        })}
      >
        <div className="container">
          <div className="grid">
            <div
              className={classNames({
                [grid({ s: 12, m: 12, l: 8, xl: 8 })]: true,
              })}
            >
              <h1
                className={classNames({
                  'no-margin': true,
                  [font('wb', 2)]: true,
                })}
              >
                {title}
              </h1>

              {description && (
                <VerticalSpace
                  v={{
                    size: 'm',
                    properties: ['margin-top'],
                  }}
                  className={classNames({
                    'first-para-no-margin body-text': true,
                  })}
                >
                  <PrismicHtmlBlock html={description} />
                </VerticalSpace>
              )}
            </div>
          </div>
        </div>
      </VerticalSpace>
    </SpacingSection>

    <SpacingSection>
      {paginatedResults.totalPages > 1 && (
        <Layout12>
          <VerticalSpace
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
          </VerticalSpace>
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

      <VerticalSpace v={{ size: 'l', properties: ['margin-top'] }}>
        <CardGrid items={paginatedResults.results} itemsPerRow={3} />
      </VerticalSpace>

      {paginatedResults.totalPages > 1 && (
        <VerticalSpace
          v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
        >
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
        </VerticalSpace>
      )}
    </SpacingSection>
  </Fragment>
);

export default LayoutPaginatedResults;
