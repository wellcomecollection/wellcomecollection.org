import {
  useState,
  useEffect,
  useContext,
  FunctionComponent,
  ReactElement,
} from 'react';
import {
  ImagesRouteProps,
  WorksRouteProps,
} from '../../../services/catalogue/ts_routes';
import {
  CatalogueAggregationBucket,
  CatalogueAggregations,
} from '../../../model/catalogue';
import SearchFiltersDesktop from '../SearchFiltersDesktop/SearchFiltersDesktop';
import SearchFiltersMobile from '../SearchFiltersMobile/SearchFiltersMobile';
import ModalFilters from '../ModalFilters/ModalFilters';
import theme from '../../themes/default';
import TogglesContext from '../TogglesContext/TogglesContext';

type Props = {
  searchForm: { current: HTMLFormElement | null };
  worksRouteProps: WorksRouteProps | ImagesRouteProps;
  workTypeAggregations: CatalogueAggregationBucket[];
  aggregations?: CatalogueAggregations;
  changeHandler: () => void;
  filtersToShow: string[];
  enableMoreFilters: boolean;
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
  aggregations?: CatalogueAggregations;
  enableMoreFilters: boolean;
  languagesInUrl: string[];
};

const SearchFilters: FunctionComponent<Props> = ({
  searchForm,
  worksRouteProps,
  workTypeAggregations,
  changeHandler,
  aggregations,
  filtersToShow,
  enableMoreFilters,
}: Props): ReactElement<Props> => {
  const workTypeInUrlArray = worksRouteProps.workType || [];
  const locationsTypeInUrlArray = worksRouteProps.itemsLocationsType || [];
  const { productionDatesFrom, productionDatesTo, color } = worksRouteProps;
  const languagesInUrl: string[] = worksRouteProps.languages || [];

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
    enableMoreFilters,
    languagesInUrl,
  };

  return (
    <>
      {modalFiltersPrototype ? (
        <ModalFilters {...sharedProps} />
      ) : (
        <>
          {isMobile ? (
            <SearchFiltersMobile {...sharedProps} />
          ) : (
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
