import * as prismic from '@prismicio/client';

import { PaginatedResults } from '@weco/common/services/prismic/types';

export function transformQuery<Doc extends prismic.PrismicDocument, Result>(
  query: prismic.Query<Doc>,
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

export function transformContentApiResponse(response, resultsTransformer) {
  return {
    currentPage: response.page,
    pageSize: response.pageSize,
    totalResults: response.totalResults,
    totalPages: response.totalPages,
    results: response.results.map(resultsTransformer),
  };
}
