// @flow

import {font, spacing} from '../../../utils/classnames';
import Control from '../Buttons/Control/Control';

export type Props = {|
  prevPage?: ?number,
  currentPage: number,
  pageCount: number,
  nextPage?: ?number,
  nextQueryString?: string,
  prevQueryString?: string,
  range?: {beginning: number, end: number}
|}

const Pagination = ({prevPage, currentPage, pageCount, nextPage, nextQueryString, prevQueryString}: Props) => (
  <div className={`pagination float-r flex-inline flex--v-center font-pewter ${font({s: 'LR3', m: 'LR2'})}`}>
    {prevPage && prevQueryString &&
      <Control
        type='light'
        url={prevQueryString}
        extraClasses={`icon--180 ${spacing({s: 2}, {margin: ['right']})}`}
        icon='arrow'
        text={`Previous (page ${prevPage})`} />
    }

    <span>Page {currentPage} of {pageCount}</span>

    {nextPage && nextQueryString &&
      <Control
        type='light'
        url={nextQueryString}
        extraClasses={`${spacing({s: 2}, {margin: ['left']})}`}
        icon='arrow'
        text={`Next (page ${nextPage})`} />
    }
  </div>
);

export default Pagination;
export class PaginationFactory {
  static fromList(
    l: [],
    total: number,
    currentPage: number = 1,
    pageSize: number = 32,
    getParams: {} = {}
  ) {
    const size = l.length;
    const pageCount = Math.ceil(total / pageSize);
    const prevPage = pageCount > 1 && currentPage !== 1 ? currentPage - 1 : null;
    const nextPage = pageCount > 1 && currentPage !== pageCount ? currentPage + 1 : null;
    const beginning = (pageSize * currentPage) - pageSize + 1;
    const range = {
      beginning: beginning,
      end: beginning + size - 1
    };
    const nextQueryString = buildQueryString(nextPage, getParams);
    const prevQueryString = buildQueryString(prevPage, getParams);
    const pagination: Pagination = {
      total,
      range,
      pageCount,
      currentPage,
      nextPage,
      prevPage,
      nextQueryString,
      prevQueryString
    };
    return pagination;
  }
}

function buildQueryString(page: number | null, getParams: {} = {}): string {
  const paramsArray = Object.keys(getParams).map((key) => {
    if (key !== 'page') {
      return `${key}=${encodeURIComponent(getParams[key])}`;
    }
  }).filter(_ => _);

  const paramsString = paramsArray.join('&');

  if (paramsArray.length && page) {
    return `?${paramsString}&page=${page}`;
  } else if (page) {
    return `?page=${page}`;
  } else if (paramsArray.length) {
    return `?${paramsString}`;
  } else {
    return '';
  }
}
