// @flow
import { useState, useEffect, useContext } from 'react';
import { type WorksRouteProps } from '@weco/common/services/catalogue/routes';
import { type CatalogueAggregationBucket } from '@weco/common/model/catalogue';
import {
  defaultWorkTypes,
  testDefaultWorkTypes,
} from '@weco/common/services/catalogue/api';
import SearchFiltersDesktop from '@weco/common/views/components/SearchFilters/SearchFiltersDesktop';
import SearchFiltersMobile from '@weco/common/views/components/SearchFilters/SearchFiltersMobile';
// $FlowFixMe (tsx)
import SearchFiltersArchivesPrototype from '@weco/common/views/components/SearchFiltersArchivesPrototype/SearchFiltersArchivesPrototype';
import theme from '@weco/common/views/themes/default';
import TogglesContext from '../TogglesContext/TogglesContext';

type Props = {|
  searchForm: {| current: ?HTMLFormElement |},
  worksRouteProps: WorksRouteProps,
  workTypeAggregations: CatalogueAggregationBucket[],
  changeHandler: () => void,
|};

export type SearchFiltersSharedProps = {|
  ...Props,
  inputDateFrom: ?string,
  inputDateTo: ?string,
  setInputDateFrom: (value: string) => void,
  setInputDateTo: (value: string) => void,
  workTypeFilters: CatalogueAggregationBucket[],
  productionDatesFrom: ?string,
  productionDatesTo: ?string,
  workTypeInUrlArray: string[],
  inputImagesColor: ?string,
  setInputImagesColor: (value: string) => void,
|};

const SearchFilters = ({
  searchForm,
  worksRouteProps,
  workTypeAggregations,
  changeHandler,
}: Props) => {
  const workTypeInUrlArray = worksRouteProps.workType || [];
  const {
    productionDatesFrom,
    productionDatesTo,
    imagesColor,
    search: searchType,
  } = worksRouteProps;

  const [isMobile, setIsMobile] = useState(false);
  const [inputDateFrom, setInputDateFrom] = useState(productionDatesFrom);
  const [inputDateTo, setInputDateTo] = useState(productionDatesTo);
  const [inputImagesColor, setInputImagesColor] = useState(imagesColor);
  const { unfilteredSearchResults, archivesPrototype } = useContext(
    TogglesContext
  );

  const workTypeFilters = unfilteredSearchResults
    ? workTypeAggregations
    : workTypeAggregations.filter(agg =>
        archivesPrototype
          ? testDefaultWorkTypes.includes(agg.data.id)
          : defaultWorkTypes.includes(agg.data.id)
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

    if (imagesColor !== inputImagesColor) {
      setInputImagesColor(imagesColor);
    }
  }, [productionDatesFrom, productionDatesTo, imagesColor]);

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

  useEffect(() => {
    if (imagesColor !== inputImagesColor && searchType === 'images') {
      changeHandler();
    }
  }, [inputImagesColor]);

  const sharedProps: SearchFiltersSharedProps = {
    searchForm,
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
    inputImagesColor,
    setInputImagesColor,
  };

  return (
    <>
      {archivesPrototype ? (
        <SearchFiltersArchivesPrototype {...sharedProps} />
      ) : (
        <>
          {isMobile ? (
            <SearchFiltersMobile {...sharedProps} />
          ) : (
            <SearchFiltersDesktop {...sharedProps} />
          )}
        </>
      )}
    </>
  );
};

export default SearchFilters;
