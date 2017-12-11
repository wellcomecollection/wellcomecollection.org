// @flow
import type {Article} from './article';
import type {ExhibitionPromo} from './exhibition-promo';
import type {Pagination} from './pagination';
import type {EventPromo} from '../content-model/events';

export type PaginatedResultsType = Article | ExhibitionPromo | EventPromo;

export type PaginatedResults = {|
  currentPage: number;
  results: Array<PaginatedResultsType>;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  pagination: Pagination;
|};
