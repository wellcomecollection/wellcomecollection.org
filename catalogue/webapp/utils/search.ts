import { CatalogueApiError } from '@weco/common/model/catalogue';
import { PrismicApiError } from '@weco/catalogue/services/prismic/types';

export type DefaultSortValuesType = {
  sort: string | undefined;
  sortOrder: string | undefined;
};

type HasResultsList<T> = {
  results: T[];
  type: 'ResultList';
};

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
  queryResults: HasResultsList<T> | CatalogueApiError | PrismicApiError;
}): T[] | undefined {
  // An error shouldn't stop the other results from displaying
  if (queryResults.type === 'Error') {
    console.error(queryResults.label + ': Error fetching ' + categoryName);
  } else {
    return queryResults.results;
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
  originalValue
    ? Array.isArray(originalValue)
      ? originalValue[0]
      : originalValue
    : undefined;

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

/**
 * Takes the 'sort' and 'sortOrder' parameters from the URL query and maps it to what the Prismic API
 * expects for its 'sortBy' parameter.
 * @param {string} sort - e.g. publication.dates
 * @param {string} sortOrder - e.g. asc
 */
export const getPrismicSortValue = ({
  sort,
  sortOrder,
}: DefaultSortValuesType): string => {
  // Map to match Prismic's API's `sortBy` attributes
  if (sortOrder && sort) {
    switch (sort) {
      case 'publication.dates':
        return 'meta_firstPublicationDate_' + sortOrder.toUpperCase();
      case 'alphabetical':
        return 'title_' + sortOrder.toUpperCase();
      default:
        // TODO change to adapt to events/exhibitions/etc;
        // this is currently what we set as default for Stories
        return 'title_ASC';
    }
  }
  // TODO change to adapt to events/exhibitions/etc;
  // this is currently what we set as default for Stories
  return 'title_ASC';
};

// FILTERS
/**
 * Compare filter options to query parameters,
 * telling us if the user has applied any filters.
 * This is used for SearchNoResult's rendered copy
 * @param {string[]} filters - Available filter options
 * @param {string[]} queryParams - URL query parameters
 */
export const hasFilters = ({
  filters,
  queryParams,
}: {
  filters: string[];
  queryParams: string[];
}): boolean => {
  return !!filters.filter(element => queryParams.includes(element)).length;
};
