import { useState, useEffect } from 'react';
import { type SearchParams } from '@weco/common/services/catalogue/search-params';
import { type CatalogueAggregationBucket } from '@weco/common/model/catalogue';
import { allWorkTypes } from '@weco/common/services/data/workTypeAggregations';
import SearchFiltersDesktop from '@weco/common/views/components/SearchFilters/SearchFiltersDesktop';
import SearchFiltersMobile from '@weco/common/views/components/SearchFilters/SearchFiltersMobile';

type Props = {|
  searchForm: React.Ref<typeof HTMLFormElement>,
  searchParams: SearchParams,
  workTypeAggregations: CatalogueAggregationBucket[],
  changeHandler: () => void,
|};

const SearchFilters = ({
  searchForm,
  searchParams,
  workTypeAggregations,
  changeHandler,
}: Props) => {
  const workTypeInUrlArray = searchParams.workType || [];
  const { productionDatesFrom, productionDatesTo } = searchParams;
  const [inputDateFrom, setInputDateFrom] = useState(productionDatesFrom);
  const [inputDateTo, setInputDateTo] = useState(productionDatesTo);
  // We want to display all currently applied worktypes to the user within the filter drop down
  // This may include worktypes that have no aggregations for the given search
  // We therefore go through all possible worktypes,
  // if they have a matching aggregation from the API response we use that
  // If they aren't included in the API response, but are one of the applied filters,// then we still include it with a count of 0.
  const workTypeFilters = allWorkTypes
    .map(workType => {
      const matchingWorkTypeAggregation = workTypeAggregations.find(
        ({ data }) => workType.data.id === data.id
      );
      const matchingAppliedWorkType = workTypeInUrlArray.find(
        id => workType.data.id === id
      );
      if (matchingWorkTypeAggregation) {
        return matchingWorkTypeAggregation;
      } else if (matchingAppliedWorkType) {
        return workType;
      } else {
        return null;
      }
    })
    .filter(Boolean);

  useEffect(() => {
    if (productionDatesFrom !== inputDateFrom) {
      setInputDateFrom(productionDatesFrom);
    }

    if (productionDatesTo !== inputDateTo) {
      setInputDateTo(productionDatesTo);
    }
  }, [productionDatesFrom, productionDatesTo]);

  useEffect(() => {
    if (
      productionDatesFrom !== inputDateFrom &&
      (!inputDateFrom || (inputDateFrom && inputDateFrom.match(/^\d{4}$/)))
    ) {
      changeHandler();
    }
  }, [inputDateFrom]);

  useEffect(() => {
    if (
      productionDatesTo !== inputDateTo &&
      (!inputDateTo || (inputDateTo && inputDateTo.match(/^\d{4}$/)))
    ) {
      changeHandler();
    }
  }, [inputDateTo]);

  const sharedProps = {
    searchForm,
    searchParams,
    workTypeAggregations,
    changeHandler,
    inputDateFrom,
    inputDateTo,
    setInputDateFrom,
    setInputDateTo,
    workTypeFilters,
    productionDatesFrom,
    productionDatesTo,
    workTypeInUrlArray,
  };

  return (
    <>
      <SearchFiltersDesktop {...sharedProps} />
      <SearchFiltersMobile {...sharedProps} />
    </>
  );
};

export default SearchFilters;
