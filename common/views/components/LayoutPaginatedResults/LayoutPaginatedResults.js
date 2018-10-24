// @flow
import { Fragment } from 'react';
import CardGrid from '../CardGrid/CardGrid';
import Layout12 from '../Layout12/Layout12';
import Divider from '../Divider/Divider';
import Pagination from '../Pagination/Pagination';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { classNames, spacing, font, grid } from '../../../utils/classnames';
import type { Period } from '../../../model/periods';
import type { UiExhibition } from '../../../model/exhibitions';
import type { UiEvent } from '../../../model/events';
import type { Book } from '../../../model/books';
import type { Article } from '../../../model/articles';
import type { PaginatedResults, HTMLString } from '../../../services/prismic/types';

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
  period?: Period
|}

const LayoutPaginatedResults = ({
  title,
  description,
  paginatedResults,
  paginationRoot,
  period
}: Props) => (
  <Fragment>
    <div className={classNames({
      'row': true,
      'bg-cream': true,
      'plain-text': true,
      [spacing({s: 3, m: 5, l: 5}, {padding: ['top', 'bottom']})]: true
    })}>
      <div className='container'>
        <div className='grid'>
          <div className={classNames({
            [grid({s: 12, m: 12, l: 8, xl: 8})]: true
          })}>
            <h1 className={classNames({
              'no-margin': true,
              [font({s: 'WB6', m: 'WB5', l: 'WB4'})]: true
            })}>{title}</h1>

            {description &&
              <div className={classNames({
                'first-para-no-margin': true,
                [spacing({s: 2}, {margin: ['top']})]: true
              })}>
                <PrismicHtmlBlock html={description} />
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    {paginatedResults.totalPages > 1  &&
      <Layout12>
        <div className={classNames({
          'flex': true,
          'flex--v-center': true,
          'font-pewter': true,
          [spacing({s: 5, m: 5, l: 5}, {padding: ['top', 'bottom']})]: true,
          [font({s: 'LR3', m: 'LR2'})]: true
        })}>
          {(paginatedResults.pageSize * paginatedResults.currentPage) - (paginatedResults.pageSize - 1)}
              -
          {paginatedResults.currentPage < paginatedResults.totalPages ? paginatedResults.pageSize * paginatedResults.currentPage : null}
          {paginatedResults.currentPage === paginatedResults.totalPages ? paginatedResults.totalResults : null}
        </div>
        <Divider extraClasses={'divider--keyline divider--pumice'} />
      </Layout12>
    }

    <div className={classNames({
      [spacing({s: 4}, {margin: ['top']})]: true
    })}>
      <Layout12>
        <div className='flex-inline flex--v-center'>
          <span className={classNames({
            [font({s: 'HNM5', m: 'HNM4'})]: true,
            [spacing({s: 4}, {margin: ['bottom']})]: true
          })}>Free admission</span>
        </div>
      </Layout12>
      <CardGrid items={paginatedResults.results} />
    </div>

    {paginatedResults.totalPages > 1 &&
      <div className={classNames({
        [spacing({s: 2, m: 2, l: 2}, {padding: ['top']})]: true,
        [spacing({s: 3, m: 3, l: 3}, {padding: ['bottom']})]: true
      })}>
        <Layout12>
          <div className='text-align-right'>
            <Pagination
              currentPage={paginatedResults.currentPage}
              pageCount={paginatedResults.totalPages}
              prevPage={paginatedResults.currentPage > 1 ? paginatedResults.currentPage - 1 : null}
              nextPage={paginatedResults.currentPage < paginatedResults.totalPages ? paginatedResults.currentPage + 1 : null}
              prevQueryString={`/${paginationRoot}` + (period ? `/${period}` : '') + (paginatedResults.currentPage > 1 ? `?page=${paginatedResults.currentPage - 1}` : '')}
              nextQueryString={`/${paginationRoot}` + (period ? `/${period}` : '') + (paginatedResults.currentPage < paginatedResults.totalPages ? `?page=${paginatedResults.currentPage + 1}` : '')}
            />
          </div>
        </Layout12>
      </div>
    }

  </Fragment>
);

export default LayoutPaginatedResults;
