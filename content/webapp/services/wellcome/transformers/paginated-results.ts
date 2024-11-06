export function transformPaginatedResults(response, resultsTransformer) {
  return {
    currentPage: response.page,
    pageSize: response.pageSize,
    totalResults: response.totalResults,
    totalPages: response.totalPages,
    results: response.results.map(resultsTransformer),
  };
}
