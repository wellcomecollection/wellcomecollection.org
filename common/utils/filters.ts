import { CatalogueAggregationBucket } from '@weco/common/model/catalogue';
import { nodeListValueToArray, inputValue } from '@weco/common/utils/forms';
import { LinkProps } from 'next/link';

import {
  worksLink,
  imagesLink,
} from '@weco/common/services/catalogue/ts_routes';

export const getFilterByCount = (
  bucketFilter: CatalogueAggregationBucket[]
): CatalogueAggregationBucket[] => {
  return bucketFilter.filter(items => {
    return items.count > 0;
  });
};

export const getFilterItemSelected = (
  form: HTMLFormElement,
  formName: string
): string[] => {
  const filterCheckboxes = nodeListValueToArray(form[formName]) || [];
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
