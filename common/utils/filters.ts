import { CatalogueAggregationBucket } from '@weco/common/model/catalogue';
import { nodeListValueToArray } from '@weco/common/utils/forms';

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
