import { ParsedUrlQuery } from 'querystring';
import { FunctionComponent, ReactElement, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import useIsomorphicLayoutEffect from '@weco/common/hooks/useIsomorphicLayoutEffect';
import { LinkProps } from '@weco/common/model/link-props';
import { Filter } from '@weco/content/services/wellcome/common/filters';
import { isNegatedValue } from '@weco/content/utils/filters';

import DateRangeFilter from './SearchFilters.DateRangeFilter';
import SearchFiltersDesktop from './SearchFilters.Desktop';
import SearchFiltersMobile from './SearchFilters.Mobile';

type Props = {
  query?: string;
  searchFormId?: string;
  changeHandler: () => void;
  filters: Filter[];
  linkResolver: (params: ParsedUrlQuery) => LinkProps;
  hasNoResults?: boolean;
};

export type SearchFiltersSharedProps = Props & { activeFiltersCount: number };

const SearchFilters: FunctionComponent<Props> = ({
  query,
  searchFormId,
  changeHandler,
  filters,
  linkResolver,
  hasNoResults,
}: Props): ReactElement<Props> => {
  const { windowSize } = useAppContext();
  // We use the setIsomorphicLayoutEffect here as we can't use CSS to
  // create a responsive layout here.
  // See: https://github.com/wellcomecollection/wellcomecollection.org/issues/6268
  const [isEnhanced, setIsEnhanced] = useState(false);
  useIsomorphicLayoutEffect(() => {
    setIsEnhanced(true);
  }, []);

  const activeFiltersCount = filters
    .map(f => {
      switch (f.type) {
        case 'color':
          return f.color ? 1 : 0;
        case 'checkbox':
          return f.options.filter(
            option => option.selected && !isNegatedValue(option.value)
          ).length;
        case 'radio':
          return f.options.filter(
            option => option.selected && option.value !== ''
          ).length;
        case 'dateRange':
          return f.from.value || f.to.value ? 1 : 0;
        case 'boolean':
          return f.isSelected ? 1 : 0;
        default:
          return 0;
      }
    })
    .reduce((acc, val) => {
      return acc + val;
    }, 0);

  const sharedProps: SearchFiltersSharedProps = {
    query,
    searchFormId,
    changeHandler,
    filters,
    linkResolver,
    activeFiltersCount,
    hasNoResults,
  };

  return isEnhanced ? (
    <section data-component="search-filters" aria-label="Search Filters">
      {windowSize === 'zero' && <SearchFiltersMobile {...sharedProps} />}
      {windowSize !== 'zero' && <SearchFiltersDesktop {...sharedProps} />}
    </section>
  ) : (
    <SearchFiltersDesktop
      data-component="search-filters-desktop"
      {...sharedProps}
    />
  );
};

export { SearchFilters as default, DateRangeFilter };
