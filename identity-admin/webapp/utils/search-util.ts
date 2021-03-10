import * as queryString from 'query-string';

export function buildSearchParams(
  page: string | string[],
  status: string | string[],
  name: string | string[],
  email: string | string[],
  sortField?: string | string[],
  sortDir?: string | string[]
): string {
  return queryString.stringify({
    page,
    status,
    name,
    email,
    sortField,
    sortDir,
  });
}

export function buildSearchUrl(
  page: string | string[],
  status: string | string[],
  name: string | string[],
  email: string | string[],
  sortField?: string | string[],
  sortDir?: string | string[]
): string {
  const params = buildSearchParams(
    page,
    status,
    name,
    email,
    sortField,
    sortDir
  );
  return params.length > 0 ? '/?' + params : '/';
}
