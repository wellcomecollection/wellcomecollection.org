import type {Article} from './article';
import type {ExhibitionPromo} from './exhibition-promo';
import type {Pagination} from './pagination';

export type PaginatedResults = {|
  currentPage: number,
  results: List<Article | ExhibitionPromo>,
  pageSize: number,
  totalResults: number,
  totalPages: number,
  pagination: Pagination
|};
