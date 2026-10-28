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

function parseJsonParam(param: unknown): unknown {
  if (!isString(param)) return;

  try {
    return JSON.parse(param);
  } catch {
    return undefined;
  }
}

/** Returns a positive page size, capped at Prismic's maximum. */
export function parsePageSize(value: unknown): number | undefined {
  const pageSize = isString(value) ? Number(value) : value;

  return isPositiveInteger(pageSize)
    ? Math.min(pageSize, maxPageSize)
    : undefined;
}

/** Keeps only page, pageSize and filters from a client's JSON `params`. */
export function parseClientSideListParams(
  param: unknown
): ClientSideListParams | undefined {
  const params = parseJsonParam(param);

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

  const parsedPageSize = parsePageSize(pageSize);

  return {
    ...(isPositiveInteger(page) && { page }),
    ...(parsedPageSize && { pageSize: parsedPageSize }),
    ...(parsedFilters && { filters: parsedFilters }),
  };
}

/** Returns document IDs from a client's JSON `params`, up to one page's worth. */
export function parseClientSideDocumentIds(
  param: unknown
): string[] | undefined {
  const params = parseJsonParam(param);

  if (
    Array.isArray(params) &&
    params.length <= maxPageSize &&
    params.every(isString)
  ) {
    return params;
  }
}
