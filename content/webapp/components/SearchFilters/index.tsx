import { ParsedUrlQuery } from 'querystring';
import { FunctionComponent, ReactElement, useContext, useState } from 'react';

import useIsomorphicLayoutEffect from '@weco/common/hooks/useIsomorphicLayoutEffect';
import { LinkProps } from '@weco/common/model/link-props';
import { partition } from '@weco/common/utils/arrays';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import {
  BooleanFilter as BooleanFilterType,
  Filter,
} from '@weco/content/services/wellcome/common/filters';

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
  const { windowSize } = useContext(AppContext);
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
          return f.options.filter(option => option.selected).length;
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

  // We need the filters to show in a specific order
  const [booleanFilters, otherFilters] = partition(
    filters,
    (f: BooleanFilterType) => f.type === 'boolean'
  );
  const orderedFilters = [...otherFilters, ...booleanFilters];

  const sharedProps: SearchFiltersSharedProps = {
    query,
    searchFormId,
    changeHandler,
    filters: orderedFilters,
    linkResolver,
    activeFiltersCount,
    hasNoResults,
  };

  return isEnhanced ? (
    <section aria-label="Search Filters">
      {windowSize === 'small' && <SearchFiltersMobile {...sharedProps} />}
      {windowSize !== 'small' && <SearchFiltersDesktop {...sharedProps} />}
    </section>
  ) : (
    <SearchFiltersDesktop {...sharedProps} />
  );
};

export { SearchFilters as default, DateRangeFilter };
