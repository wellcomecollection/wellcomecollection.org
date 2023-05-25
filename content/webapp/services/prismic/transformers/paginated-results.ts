import { PrismicDocument, Query } from '@prismicio/client';
import { PaginatedResults } from '@weco/common/services/prismic/types';

export function transformQuery<Doc extends PrismicDocument, Result>(
  query: Query<Doc>,
  resultsTransformer: (doc: Doc) => Result
): PaginatedResults<Result> {
  return {
    currentPage: query.page,
    pageSize: query.results_per_page,
    totalResults: query.total_results_size,
    totalPages: query.total_pages,
    results: query.results.map(resultsTransformer),
  };
}
