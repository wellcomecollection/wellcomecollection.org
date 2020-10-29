import { useState, useEffect, useContext } from 'react';
import { WorksRouteProps } from '@weco/common/services/catalogue/ts_routes';
import {
  CatalogueAggregationBucket,
  CatalogueAggregations,
} from '@weco/common/model/catalogue';
import SearchFiltersDesktop from '@weco/common/views/components/PrototypeSearchFilters/PrototypeSearchFiltersDesktop';
// import SearchFiltersMobile from '@weco/common/views/components/SearchFilters/SearchFiltersMobile';
import ModalFilters from '@weco/common/views/components/ModalFilters/ModalFilters';
import theme from '@weco/common/views/themes/default';
import TogglesContext from '../TogglesContext/TogglesContext';

type Props = {
  searchForm: { current: HTMLFormElement | null };
  worksRouteProps: WorksRouteProps;
  workTypeAggregations: CatalogueAggregationBucket[];
  aggregations: CatalogueAggregations | null;
  changeHandler: () => void;
  filtersToShow: string[];
};

export type SearchFiltersSharedProps = Props & {
  inputDateFrom: string | null;
  inputDateTo: string | null;
  setInputDateFrom: (value: string) => void;
  setInputDateTo: (value: string) => void;
  workTypeFilters: CatalogueAggregationBucket[];
  productionDatesFrom: string | null;
  productionDatesTo: string | null;
  workTypeInUrlArray: string[];
  locationsTypeInUrlArray: string[];
  imagesColor: string | null;
  aggregations: CatalogueAggregations | null;
};

const SearchFilters = ({
  searchForm,
  worksRouteProps,
  workTypeAggregations,
  changeHandler,
  aggregations,
  filtersToShow,
}: Props) => {
  const workTypeInUrlArray = worksRouteProps.workType || [];
  const locationsTypeInUrlArray = worksRouteProps.itemsLocationsType || [];
  const { productionDatesFrom, productionDatesTo, color } = worksRouteProps;

  const [isMobile, setIsMobile] = useState(false);
  const [inputDateFrom, setInputDateFrom] = useState(productionDatesFrom);
  const [inputDateTo, setInputDateTo] = useState(productionDatesTo);
  const { modalFiltersPrototype } = useContext(TogglesContext);

  const workTypeFilters = workTypeAggregations;

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

  const sharedProps: SearchFiltersSharedProps = {
    searchForm,
    filtersToShow,
    worksRouteProps,
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
    locationsTypeInUrlArray,
    imagesColor: color,
    aggregations,
  };

  return (
    <>
      {modalFiltersPrototype ? (
        <ModalFilters {...sharedProps} />
      ) : (
        <>
          {isMobile ? (
            <p>TODO: mobile</p>
          ) : (
            // <SearchFiltersMobile {...sharedProps} />
            <>
              <SearchFiltersDesktop {...sharedProps} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default SearchFilters;
