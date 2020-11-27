import { ParsedUrlQuery } from 'querystring';
export type UrlParams = { [key: string]: string };

export function parseUrlParams(query: ParsedUrlQuery): UrlParams {
  const parsedQuerys = Object.entries(query).reduce((acc, [key, val]) => {
    return {
      ...acc,
      [key]: parseQueryParam(val),
    };
  }, {});
  return parsedQuerys;
}

export function parseQueryParam(param: string | string[]): string {
  const parseParam = Array.isArray(param) ? param.join(',') : param;
  return typeof parseParam === 'string' ? parseParam : '';
}
