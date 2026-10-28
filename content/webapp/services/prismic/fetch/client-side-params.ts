import { isString } from '@weco/common/utils/type-guards';

// Prismic's own maximum page size
export const maxPageSize = 100;

export type ClientSideListParams = {
  page?: number;
  pageSize?: number;
  filters?: string[];
};

const isPositiveInteger = (v: unknown): v is number =>
  Number.isInteger(v) && (v as number) > 0;

/** Narrows params parsed from a client request to the query options the
 * /api list routes accept, so a request can't pass anything else (refs,
 * orderings, oversized pages) to Prismic with the server's token.
 *
 * Returns undefined if the params can't be used.
 */
export function parseClientSideListParams(
  params: unknown
): ClientSideListParams | undefined {
  if (typeof params !== 'object' || params === null || Array.isArray(params)) {
    return;
  }

  const { page, pageSize, filters } = params as Record<string, unknown>;

  const parsedFilters = isString(filters) ? [filters] : filters;
  if (
    parsedFilters !== undefined &&
    !(Array.isArray(parsedFilters) && parsedFilters.every(isString))
  ) {
    return;
  }

  return {
    ...(isPositiveInteger(page) && { page }),
    ...(isPositiveInteger(pageSize) && {
      pageSize: Math.min(pageSize, maxPageSize),
    }),
    ...(parsedFilters && { filters: parsedFilters }),
  };
}

/** Returns the document IDs from client params if they're a list of strings
 * no longer than a single page of Prismic results.
 */
export function parseClientSideDocumentIds(
  params: unknown
): string[] | undefined {
  if (
    Array.isArray(params) &&
    params.length <= maxPageSize &&
    params.every(isString)
  ) {
    return params;
  }
}
