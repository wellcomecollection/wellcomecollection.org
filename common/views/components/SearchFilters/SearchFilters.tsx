import { useState, FunctionComponent, ReactElement } from 'react';
import SearchFiltersDesktop from '../SearchFiltersDesktop/SearchFiltersDesktop';
import SearchFiltersMobile from '../SearchFiltersMobile/SearchFiltersMobile';
import { WorksProps } from '../WorksLink/WorksLink';
import { ImagesProps } from '../ImagesLink/ImagesLink';

type Props = {
  query: string;
  searchForm: { current: HTMLFormElement | null };
  changeHandler: () => void;
  filters: Filter[];
};

export type SearchFiltersSharedProps = Props;

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
  query,
  searchForm,
  changeHandler,
  filters,
}: Props): ReactElement<Props> => {
  const [isMobile, setIsMobile] = useState(false);

  const sharedProps: SearchFiltersSharedProps = {
    query,
    searchForm,
    changeHandler,
    filters,
  };

  return (
    <>
      {isMobile ? (
        <SearchFiltersMobile {...sharedProps} />
      ) : (
        <>
          <SearchFiltersDesktop {...sharedProps} />
        </>
      )}
    </>
  );
};

export default SearchFilters;
