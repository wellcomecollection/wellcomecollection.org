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
  static fromList(l: List<any>, total: number, currentPage: number = 1): Pagination {
    const size = l.size || 1;
    console.log(size);
    const pageCount = Math.ceil(total / size);
    const prevPage = pageCount > 1 && currentPage !== 1 ? currentPage - 1 : null;
    const nextPage = pageCount > 1 && currentPage !== pageCount ? currentPage + 1 : null;
    const range = {
      beginning: (size * currentPage) - size + 1,
      end: size * currentPage
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
