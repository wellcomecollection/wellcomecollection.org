// @flow
import {List} from 'immutable';

export type Pagination = {|
  total: number;
  range: { beginning: number, end: number },
  pageCount: number;
  currentPage: number;
  nextPage?: ?number;
  prevPage?: ?number;
  nextQueryString?: ?string;
  prevQueryString?: ?string;
|}

export class PaginationFactory {
  static fromList(l: List<any>, total: number, currentPage: number = 1, pageSize: number = 32, getParams: {} = {}): Pagination {
    const size = l.size;
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
      return `${key}=${getParams[key]}`;
    }
  }).filter(_ => _);

  const paramsString = paramsArray.join('&');

  if (paramsArray.length && page) {
    return `?page=${page}&${paramsString}`;
  } else if (page) {
    return `?page=${page}`;
  } else if (paramsArray.length) {
    return `?${paramsString}`;
  } else {
    return '';
  }
}
