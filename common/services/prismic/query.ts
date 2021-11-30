import { PrismicDocument, Query } from '@prismicio/types';

export function emptyPrismicQuery<T extends PrismicDocument>(): Query<T> {
  return {
    page: 1,
    results_per_page: 0,
    results_size: 0,
    total_results_size: 0,
    total_pages: 0,
    next_page: null,
    prev_page: null,
    results: [] as T[],
  };
}
