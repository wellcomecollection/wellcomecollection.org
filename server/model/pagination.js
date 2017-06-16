// @flow
import {List} from 'immutable';

export type Pagination = {|
  total: number;
  range: { beginning: number, end: number },
  pageCount: number;
  currentPage: number;
  nextPage?: ?number;
  prevPage?: ?number;
|}

export class PaginationFactory {
  static fromList(l: List<any>, total: number, currentPage: number = 1, pageSize: number = 32): Pagination {
    const size = l.size || 1;
    const pageCount = Math.ceil(total / pageSize);
    const prevPage = pageCount > 1 && currentPage !== 1 ? currentPage - 1 : null;
    const nextPage = pageCount > 1 && currentPage !== pageCount ? currentPage + 1 : null;
    const beginning = (pageSize * currentPage) - pageSize + 1;
    const range = {
      beginning: beginning,
      end: beginning + size - 1
    };

    const pagination: Pagination = {
      total,
      range,
      pageCount,
      currentPage,
      nextPage,
      prevPage
    };
    return pagination;
  }
}
