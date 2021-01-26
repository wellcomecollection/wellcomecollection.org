import {
  CatalogueAggregationBucket,
  CatalogueAggregations,
} from '@weco/common/model/catalogue';
import { nodeListValueToArray, inputValue } from '@weco/common/utils/forms';
import { LinkProps } from 'next/link';

import {
  worksLink,
  imagesLink,
} from '@weco/common/services/catalogue/ts_routes';

export const getNonEmptyFilters = (
  bucket: CatalogueAggregationBucket[]
): CatalogueAggregationBucket[] => {
  return bucket.filter(items => {
    return items.count > 0;
  });
};

export const getAggregationFilterByName = (
  aggregations: CatalogueAggregations | undefined,
  name: string
): CatalogueAggregationBucket[] | [] => {
  return aggregations && aggregations?.[name]?.buckets
    ? getNonEmptyFilters(aggregations?.[name]?.buckets)
    : [];
};

type RadioGroupOption = {
  value: string;
  id: string;
  label: string;
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

export const getAggregationRadioGroup = (
  aggregation: CatalogueAggregationBucket[],
  prefixId: string
): RadioGroupOption[] => {
  const radioOption = aggregation.sort(sortByCount).map(item => {
    const id = item?.data?.label.replace(/\s/, '-').toLocaleLowerCase();
    return {
      value: item?.data?.label,
      id: `${prefixId}-${id}`,
      label: `${item?.data?.label} (${item?.count})`,
    };
  });

  return radioOption;
};

export const getFilterItemSelected = (
  form: HTMLFormElement,
  inputElement: string
): string[] => {
  const filterCheckboxes = nodeListValueToArray(form[inputElement]) || [];
  const selectedFilter = [...filterCheckboxes].filter(
    selectedFilter => selectedFilter.checked
  );
  return selectedFilter.length > 0
    ? selectedFilter.map(filter => filter.value)
    : [];
};

export const getResetFilterLink = (
  imagesColor: string | null,
  resetFiltersRoute: any
): any => {
  const resetFiltersLink: LinkProps = imagesColor
    ? imagesLink(
        { ...resetFiltersRoute, locationsLicense: null, color: null },
        'cancel_filter/all'
      )
    : worksLink(resetFiltersRoute, 'cancel_filter/all');
  return resetFiltersLink;
};

export const getSelectedFilterColor = (form: HTMLFormElement): string => {
  const imagesColorValue = inputValue(form['images.color']);
  const imagesColor =
    typeof imagesColorValue === 'string'
      ? imagesColorValue.replace('#', '')
      : imagesColorValue;
  return imagesColor;
};
