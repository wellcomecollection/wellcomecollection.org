import { ParsedUrlQuery } from 'querystring';
export type UrlParams = { [key: string]: string };

export function parseUrlParams(query: ParsedUrlQuery): UrlParams {
  const parsedQuerys = Object.entries(query).reduce((acc, [key, val]) => {
    const parsedVal = parseQueryParam(val);
    if (parsedVal) {
      return {
        ...acc,
        [key]: parsedVal,
      };
    }

    return acc;
  }, {});
  return parsedQuerys;
}

export function parseQueryParam(
  param: string | string[] | undefined
): string | undefined {
  const parseParam = Array.isArray(param) ? param.join(',') : param;
  return typeof parseParam === 'string' ? parseParam : undefined;
}
