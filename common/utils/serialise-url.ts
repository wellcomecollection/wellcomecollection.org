// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParsedUrlQuery = { [key: string]: any };
export type UrlParams = { [key: string]: string };

export function parseUrlParams(
  query: Readonly<ParsedUrlQuery>,
  paramsToConvert: string[]
): UrlParams {
  const newParams = { ...query }; // clone variable as it modifies original
  // query contains global context, being specific on parsing
  const itemToConvert = Object.keys(newParams).filter(param => {
    if (paramsToConvert.includes(param)) {
      return true;
    }
    return false;
  });

  // convert the items to string else return back
  itemToConvert.forEach(key => {
    newParams[key] = parseQueryParam(newParams[key]);
  });
  return newParams;
}

export function parseQueryParam(param: string | []): string {
  return Array.isArray(param) ? param.join(',') : param;
}
