import {
  CatalogueAggregationBucket,
  CatalogueAggregationContributorsBucket,
  CatalogueAggregations,
} from '@weco/common/model/catalogue';
import { nodeListValueToArray, inputValue } from '@weco/common/utils/forms';
import { LinkProps } from '@weco/common/model/link-props';
import {
  worksLink,
  imagesLink,
  WorksRouteProps,
} from '@weco/common/services/catalogue/ts_routes';

export const getNonEmptyAggregations = (
  bucket: CatalogueAggregationBucket[]
): CatalogueAggregationBucket[] => {
  return bucket.filter(items => {
    return items.count > 0;
  });
};

export const getAggregationFilterByName = (
  aggregations: CatalogueAggregations | undefined,
  name: keyof CatalogueAggregations
): CatalogueAggregationBucket[] | [] => {
  const bucketName =
    aggregations &&
    Object.keys(aggregations).find(aggregation => {
      if (aggregation === name) {
        return true;
      }
    });

  return aggregations && bucketName && aggregations?.[bucketName]?.buckets
    ? getNonEmptyAggregations(aggregations?.[bucketName]?.buckets)
    : [];
};

export const getAggregationContributors = (
  aggregations: CatalogueAggregations | undefined
): CatalogueAggregationContributorsBucket[] | [] => {
  return aggregations && aggregations?.['contributors']?.buckets
    ? aggregations?.['contributors']?.buckets
    : [];
};

// sort by the highest count
export const sortByCount = (
  a: CatalogueAggregationBucket,
  b: CatalogueAggregationBucket
): number => {
  if (a.count > b.count) {
    return -1;
  } else {
    return 1;
  }
};

export const replaceSpaceWithHypen = (
  itemString: string,
  replace = '-'
): string => {
  return itemString.replace(/\s/, replace).toLocaleLowerCase();
};

export const sortLabelByAlphabeticalOrder = (
  a: CatalogueAggregationBucket,
  b: CatalogueAggregationBucket
): number => {
  if (a.data.label.toLowerCase() < b.data.label.toLowerCase()) {
    return -1;
  }
  if (a.data.label.toLowerCase() > b.data.label.toLowerCase()) {
    return 1;
  }
  return 0;
};

export const getFilterItemSelected = (
  form: HTMLFormElement,
  inputElement: string
): string[] => {
  const filterCheckboxes = nodeListValueToArray(form[inputElement]) || [];
  const selectedFilter = [...filterCheckboxes].filter(
    selectedFilter => selectedFilter.checked
  );
  return selectedFilter.map(filter => filter.value);
};

export const getResetWorksFiltersLink = (
  resetFiltersRoute: WorksRouteProps
): LinkProps => {
  return worksLink(resetFiltersRoute, 'cancel_filter/all');
};

export const getResetImagesFiltersLink = (
  resetFiltersRoute: WorksRouteProps
): LinkProps => {
  return imagesLink(
    { ...resetFiltersRoute, locationsLicense: null, color: null },
    'cancel_filter/all'
  );
};

export const getResetRouteProps = (
  worksRouteProps: WorksRouteProps
): WorksRouteProps => {
  return {
    ...worksRouteProps,
    itemsLocationsLocationType: [],
    availabilities: [],
    workType: [],
    page: 1,
    productionDatesFrom: null,
    productionDatesTo: null,
    subjectsLabel: null,
    genresLabel: null,
    languages: null,
    contributorsAgentLabel: null,
  };
};

export const getSelectedFilterColor = (form: HTMLFormElement): string => {
  const imagesColorValue = inputValue(form['images.color']);
  const imagesColor =
    typeof imagesColorValue === 'string'
      ? imagesColorValue.replace('#', '')
      : imagesColorValue;
  return imagesColor || '';
};

export const sortAggregationBucket = (
  filter: CatalogueAggregationBucket[],
  sortBy?: 'alphabetical'
): CatalogueAggregationBucket[] => {
  switch (sortBy) {
    case 'alphabetical':
      return filter.sort(sortLabelByAlphabeticalOrder);
    default:
      return filter;
  }
};
