import { CatalogueAggregationBucket } from '@weco/common/model/catalogue';

export const getFilterByCount = (
  bucketFilter: CatalogueAggregationBucket[]
): CatalogueAggregationBucket[] => {
  return bucketFilter.filter(items => {
    return items.count > 0;
  });
};
