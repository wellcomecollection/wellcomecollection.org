import {
  useState,
  useEffect,
  useContext,
  FunctionComponent,
  ReactElement,
} from 'react';
import { ImagesRouteProps } from '../../../services/catalogue/ts_routes';
import {
  CatalogueAggregationBucket,
  CatalogueAggregations,
} from '../../../model/catalogue';
import SearchFiltersDesktop from '../SearchFiltersDesktop/SearchFiltersDesktop';
import SearchFiltersMobile from '../SearchFiltersMobile/SearchFiltersMobile';
import theme from '../../themes/default';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { WorksProps } from '../WorksLink/WorksLink';
import { ImagesProps } from '../ImagesLink/ImagesLink';

type Props = {
  searchForm: { current: HTMLFormElement | null };
  worksRouteProps: WorksProps | ImagesRouteProps;
  workTypeAggregations: CatalogueAggregationBucket[];
  aggregations?: CatalogueAggregations;
  changeHandler: () => void;
  filtersToShow: string[];
  filters: Filter[];
};

export type SearchFiltersSharedProps = Props & {
  inputDateFrom: string | undefined;
  inputDateTo: string | undefined;
  setInputDateFrom: (value: string) => void;
  setInputDateTo: (value: string) => void;
  workTypeFilters: CatalogueAggregationBucket[];
  productionDatesFrom: string | undefined;
  productionDatesTo: string | undefined;
  workTypeSelected: string[];
  locationsTypeSelected: string[];
  imagesColor: string | undefined;
  aggregations?: CatalogueAggregations;
  languagesSelected: string[];
  subjectsSelected: string[];
  genresSelected: string[];
  isEnhanced: boolean;
  contributorsSelected: string[];
  filters: Filter[];
};

export type DateRangeFilter = {
  type: 'dateRange';
  id: string;
  label: string;
  to: {
    key: keyof WorksProps;
    id: string;
    value: string | undefined;
  };
  from: {
    key: keyof WorksProps;
    id: string;
    value: string | undefined;
  };
};

export type CheckboxFilter = {
  type: 'checkbox';
  key: keyof WorksProps;
  id: string;
  label: string;
  options: {
    id: string;
    value: string;
    count: number;
    label: string;
    selected: boolean;
  }[];
};

export type ColorFilter = {
  type: 'color';
  key: keyof ImagesProps;
  id: string;
  label: string;
  color: string | undefined;
};

export type Filter = CheckboxFilter | DateRangeFilter | ColorFilter;

const SearchFilters: FunctionComponent<Props> = ({
  searchForm,
  worksRouteProps,
  workTypeAggregations,
  changeHandler,
  aggregations,
  filtersToShow,
  filters,
}: Props): ReactElement<Props> => {
  const { productionDatesFrom, productionDatesTo, color } = worksRouteProps;
  const languagesSelected: string[] = worksRouteProps?.languages || [];
  const subjectsSelected: string[] = worksRouteProps?.subjectsLabel || [];
  const genresSelected: string[] = worksRouteProps?.genresLabel || [];
  const workTypeSelected = worksRouteProps.workType || [];
  const locationsTypeSelected = worksRouteProps.itemsLocationsType || [];
  const contributorsSelected: string[] =
    worksRouteProps?.contributorsAgentLabel || [];

  const [isMobile, setIsMobile] = useState(false);
  const [inputDateFrom, setInputDateFrom] = useState(productionDatesFrom);
  const [inputDateTo, setInputDateTo] = useState(productionDatesTo);
  const { isEnhanced } = useContext(AppContext);
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
    workTypeSelected,
    locationsTypeSelected,
    imagesColor: color,
    aggregations,
    languagesSelected,
    subjectsSelected,
    genresSelected,
    isEnhanced,
    contributorsSelected,
  };

  return (
    <>
      {isMobile ? (
        <SearchFiltersMobile {...sharedProps} filters={filters} />
      ) : (
        <>
          <SearchFiltersDesktop {...sharedProps} filters={filters} />
        </>
      )}
    </>
  );
};

export default SearchFilters;
