import { propsToQuery } from './routes';

export type DefaultSortValuesType = {
  sort: string | undefined;
  sortOrder: string | undefined;
};

type ResultsList<T> = {
  results: T[];
  totalResults: number;
  type: 'ResultList';
  _requestUrl?: string;
};

type ApiError = {
  type: 'Error';
  label: string;
};

export type ReturnedResults<T> = {
  pageResults: T[];
  totalResults: number;
  requestUrl?: string;
};

export const SEARCH_PAGES_FORM_ID = 'search-page-form';

/**
 * Takes query result and checks for errors to log before returning required data.
 * @param {string} categoryName - e.g. works
 * @param queryResults - Original result from query
 */
export function getQueryResults<T>({
  categoryName,
  queryResults,
}: {
  categoryName: string;
  queryResults: ResultsList<T> | ApiError;
}): ReturnedResults<T> | undefined {
  // An error shouldn't stop the other results from displaying
  if (queryResults.type === 'Error') {
    console.error(queryResults.label + ': Error fetching ' + categoryName);
  } else {
    return {
      pageResults: queryResults.results,
      totalResults: queryResults.totalResults,
      requestUrl: queryResults._requestUrl,
    };
  }
}

/**
 * Query properties can an array or a single value.
 * This returns the first value of the array || string value
 * @param originalValue - Value from URL query
 */
export const getQueryPropertyValue = (
  originalValue?: string[] | string
): string | undefined =>
  Array.isArray(originalValue) ? originalValue[0] : originalValue;

// SORT
// The works API expects 'sort' and 'sortOrder' parameters, whereas the Prismic API only wants one; 'sortBy'.
// As those are taken from the URL query and we know we'll eventually fetch everything from the former API,
// We'd like our URL structure to match, therefore we need to to some mapping for it.
//

/**
 * Takes "select option"'s value and transforms it into our URL query parameters
 * The options values are structured like "publication.dates.asc" or "alphabetical.desc"
 * @param {string} sortOptionValue - e.g. publication.dates.asc
 */
export const getUrlQueryFromSortValue = (
  sortOptionValue: string
): DefaultSortValuesType => {
  // Here we take the last part and split it
  const valueArray = sortOptionValue.split('.');

  // e.g. "asc" OR "desc"
  const sortOrder = valueArray[valueArray.length - 1];

  // e.g. "publication.dates" OR "alphabetical"
  const sort = valueArray.slice(0, valueArray.length - 1).join('.');

  return { sort, sortOrder };
};

// ROUTING
// TODO review if the removal of `source` is still necessary. At the time of writing, we couldn't find a working example
// and are waiting to see if it's still needed after moving to NextLinks which remove it themselves.
// https://wellcome.slack.com/archives/C3TQSF63C/p1677248039025289
/**
 * Cleans up the URL for form submissions in order to avoid unwanted query parameters
 * @param {Record<string, string | string[] | number | undefined>} params - Form values
 * @param {string} pathname - Destination pathname, e.g. "/search/images"
 */
export const linkResolver = ({
  params,
  pathname,
}: {
  params: Record<string, string | string[] | number | undefined>;
  pathname: string;
}) => {
  const queryWithSource = propsToQuery(params);

  return {
    href: {
      pathname,
      query: queryWithSource,
    },
  };
};
