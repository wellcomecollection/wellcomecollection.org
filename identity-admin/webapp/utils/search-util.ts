import { SortField } from '../interfaces';
import * as queryString from 'querystring';

export function buildSearchParams(
  page: string | string[],
  status: string | string[],
  name: string | string[],
  email: string | string[],
  sortField?: string | string[],
  sortDir?: string | string[]
): string {
  let params = {};
  if (page) {
    params = { ...params, page: page };
  }
  if (status) {
    params = { ...params, status: status };
  }
  if (name) {
    params = { ...params, name: name };
  }
  if (email) {
    params = { ...params, email: email };
  }
  if (
    sortField &&
    typeof sortField === 'string' &&
    Object.values(SortField).includes(sortField as SortField)
  ) {
    params = { ...params, sort: sortField };
  }
  if (sortDir && (sortDir === '1' || sortDir === '-1')) {
    params = { ...params, sortDir: sortDir };
  }
  return queryString.stringify(params);
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
