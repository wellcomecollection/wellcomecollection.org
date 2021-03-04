import { SortField } from '../interfaces';

export function buildSearchParams(
  page: string | string[],
  status: string | string[],
  name: string | string[],
  email: string | string[],
  sortField?: string | string[],
  sortDir?: string | string[]
): string[] {
  const params: string[] = [];
  if (page) {
    params.push('page=' + page);
  }
  if (status) {
    params.push('status=' + status);
  }
  if (name) {
    params.push('name=' + name);
  }
  if (email) {
    params.push('email=' + email);
  }
  if (
    sortField &&
    typeof sortField === 'string' &&
    Object.values(SortField).includes(sortField as SortField)
  ) {
    params.push('sort=' + sortField);
  }
  if (sortDir && (sortDir === '1' || sortDir === '-1')) {
    params.push('sortDir=' + sortDir);
  }
  return params;
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
  return params.length > 0 ? '/?' + params.join('&') : '/';
}
