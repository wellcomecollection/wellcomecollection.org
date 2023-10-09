import { propsToQuery } from './routes';
import { ParsedUrlQuery } from 'querystring';
import { isNotUndefined } from './type-guards';
import { Filter } from '@weco/content/services/wellcome/catalogue/filters';

export type DefaultSortValuesType = {
  sort: string | undefined;
  sortOrder: string | undefined;
};

type ResultsList<T> = {
  results: T[];
  totalResults: number;
  type: 'ResultList';
};

type ApiError = {
  type: 'Error';
  label: string;
};

export type ReturnedResults<T> = {
  pageResults: T[];
  totalResults: number;
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
  queryResults: ResultsList<T> | ApiError;
}): ReturnedResults<T> | undefined {
  // An error shouldn't stop the other results from displaying
  if (queryResults.type === 'Error') {
    console.error(queryResults.label + ': Error fetching ' + categoryName);
  } else {
    return {
      pageResults: queryResults.results,
      totalResults: queryResults.totalResults,
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

/**
 * Gets the active filters' labels as they are needed for aria-live readings
 * @param {Filter[]} filters - Available filter options
 */
export const getActiveFiltersLabel = ({
  filters,
}: {
  filters: Filter[];
}): string[] => {
  return filters
    .map(f => {
      if (f.type === 'checkbox') {
        const activeOptions = f.options.filter(option => option.selected);
        return activeOptions.map(o => o.label);
      } else if (f.type === 'dateRange') {
        let dateRange = '';
        if (f.from.value) dateRange = `From ${f.from.value} `;
        if (f.to.value) dateRange = dateRange + `to up to ${f.to.value}`;
        return dateRange || undefined;
      } else if (f.type === 'color' && f.color) {
        return getColorDisplayName(f.color) || undefined;
      }
      return undefined;
    })
    .filter(isNotUndefined)
    .flat();
};

// FILTERS: Colour
type ColorSwatch = {
  hexValue: string;
  colorName: string;
};
export const palette: ColorSwatch[] = [
  {
    hexValue: 'e02020',
    colorName: 'Red',
  },
  {
    hexValue: 'ff47d1',
    colorName: 'Pink',
  },
  {
    hexValue: 'fa6400',
    colorName: 'Orange',
  },
  {
    hexValue: 'f7b500',
    colorName: 'Yellow',
  },
  {
    hexValue: '8b572a',
    colorName: 'Brown',
  },
  {
    hexValue: '6dd400',
    colorName: 'Green',
  },
  {
    hexValue: '22bbff',
    colorName: 'Blue',
  },
  {
    hexValue: '8339e8',
    colorName: 'Violet',
  },
  {
    hexValue: '000000',
    colorName: 'Black',
  },
  {
    hexValue: 'd9d3d3',
    colorName: 'Grey',
  },
];

/**
 * Gets the display name from the hex string
 * @param {string | null} color - colour's hex string
 */
export function getColorDisplayName(color: string | null): string | null {
  if (color) {
    const matchingPaletteColor = palette.find(
      swatch => swatch.hexValue.toUpperCase() === color.toUpperCase()
    );
    const hexValue = `#${color.toUpperCase()}`;
    return matchingPaletteColor ? matchingPaletteColor.colorName : hexValue;
  } else {
    return 'None';
  }
}

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

  // `source` is used in Segment to show how a person got to the page
  // but we don't want it to display in the URL
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { source = undefined, ...queryWithoutSource } = {
    ...queryWithSource,
  };

  const as = {
    pathname,
    query: queryWithoutSource as ParsedUrlQuery,
  };

  const href = {
    pathname,
    query: queryWithSource,
  };

  return { href, as };
};
