import { FunctionComponent, ReactElement, useContext } from 'react';
import { ParsedUrlQuery } from 'querystring';
import SearchFiltersDesktop from '../SearchFiltersDesktop/SearchFiltersDesktop';
import SearchFiltersMobile from '../SearchFiltersMobile/SearchFiltersMobile';
import { LinkProps } from '../../../model/link-props';
import { Filter } from '../../../services/catalogue/filters';
import { AppContext } from '../AppContext/AppContext';

type Props = {
  query: string;
  searchForm: { current: HTMLFormElement | null };
  changeHandler: () => void;
  filters: Filter[];
  linkResolver: (params: ParsedUrlQuery) => LinkProps;
};

export type SearchFiltersSharedProps = Props & { activeFiltersCount: number };

const SearchFilters: FunctionComponent<Props> = ({
  query,
  searchForm,
  changeHandler,
  filters,
  linkResolver,
}: Props): ReactElement<Props> => {
  const { windowSize } = useContext(AppContext);

  const activeFiltersCount = filters
    .map(f => {
      switch (f.type) {
        case 'color':
          return f.color ? 1 : 0;
        case 'checkbox':
          return f.options.filter(option => option.selected).length;
        case 'dateRange':
          return f.from.value || f.to.value ? 1 : 0;
        default:
          return 0;
      }
    })
    .reduce((acc, val) => {
      return acc + val;
    }, 0);

  const sharedProps: SearchFiltersSharedProps = {
    query,
    searchForm,
    changeHandler,
    filters,
    linkResolver,
    activeFiltersCount,
  };

  return (
    <>
      {windowSize === 'small' ? (
        <>
          <SearchFiltersMobile {...sharedProps} />
        </>
      ) : (
        <>
          <SearchFiltersDesktop {...sharedProps} />
        </>
      )}
    </>
  );
};

export default SearchFilters;
