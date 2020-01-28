import { useState, useEffect, useContext } from 'react';
import {
  type WorksParams,
  defaultWorkTypes,
} from '@weco/common/services/catalogue/codecs';
import { type CatalogueAggregationBucket } from '@weco/common/model/catalogue';
import SearchFiltersDesktop from '@weco/common/views/components/SearchFilters/SearchFiltersDesktop';
import SearchFiltersMobile from '@weco/common/views/components/SearchFilters/SearchFiltersMobile';
import theme from '@weco/common/views/themes/default';
import TogglesContext from '../TogglesContext/TogglesContext';

type Props = {|
  searchForm: React.Ref<typeof HTMLFormElement>,
  worksParams: WorksParams,
  workTypeAggregations: CatalogueAggregationBucket[],
  changeHandler: () => void,
|};

export type SearchFiltersSharedProps = {|
  ...Props,
  inputDateFrom: string,
  inputDateTo: string,
  setInputDateFrom: () => void,
  setInputDateTo: () => void,
  workTypeFilters: string[],
  productionDatesFrom: ?string,
  productionDatesTo: ?string,
  workTypeInUrlArray: string[],
|};

const SearchFilters = ({
  searchForm,
  worksParams,
  workTypeAggregations,
  changeHandler,
}: Props) => {
  const workTypeInUrlArray = worksParams.workType || [];
  const { productionDatesFrom, productionDatesTo } = worksParams;

  const [isMobile, setIsMobile] = useState(false);
  const [inputDateFrom, setInputDateFrom] = useState(productionDatesFrom);
  const [inputDateTo, setInputDateTo] = useState(productionDatesTo);
  const { unfilteredSearchResults } = useContext(TogglesContext);

  const workTypeFilters = unfilteredSearchResults
    ? workTypeAggregations
    : workTypeAggregations.filter(agg =>
        defaultWorkTypes.includes(agg.data.id)
      );

  useEffect(() => {
    function updateIsMobile() {
      setIsMobile(window.innerWidth < theme.sizes.medium);
    }

    window.addEventListener('resize', updateIsMobile);

    updateIsMobile();

    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

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
    worksParams,
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
      {isMobile ? (
        <SearchFiltersMobile {...sharedProps} />
      ) : (
        <SearchFiltersDesktop {...sharedProps} />
      )}
    </>
  );
};

export default SearchFilters;
