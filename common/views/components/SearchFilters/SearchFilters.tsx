import { FunctionComponent, ReactElement } from 'react';
import { ParsedUrlQuery } from 'querystring';
import SearchFiltersDesktop from '../SearchFiltersDesktop/SearchFiltersDesktop';
import SearchFiltersMobile from '../SearchFiltersMobile/SearchFiltersMobile';
import { LinkProps } from '../../../model/link-props';
import { Filter } from '../../../services/catalogue/filters';
import useWindowSize from '../../../hooks/useWindowSize';

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
  // We set this as xlarge as the jank is more noticable on desktop,
  // so we're living with the jank on mobile for now.
  const size = useWindowSize('xlarge');

  const activeFiltersCount = filters
    .map(f => {
      if (f.type === 'checkbox') {
        return f.options.filter(option => option.selected).length;
      }

      if (f.type === 'dateRange') {
        if (f.from.value || f.to.value) {
          return 1;
        }
      }

      return 0;
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
      {size === 'small' ? (
        <SearchFiltersMobile {...sharedProps} />
      ) : (
        <SearchFiltersDesktop {...sharedProps} />
      )}
    </>
  );
};

export default SearchFilters;
