import { FunctionComponent, ReactElement, useContext, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';

import { LinkProps } from '@weco/common/model/link-props';
import { Filter } from '@weco/catalogue/services/wellcome/catalogue/filters';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import useIsomorphicLayoutEffect from '@weco/common/hooks/useIsomorphicLayoutEffect';

import SearchFiltersDesktop from './SearchFilters.Desktop';
import SearchFiltersMobile from './SearchFilters.Mobile';
import DateRangeFilter from './SearchFilters.DateRangeFilter';

type Props = {
  query?: string;
  searchFormId?: string;
  changeHandler: () => void;
  filters: Filter<string>[];
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
    <section aria-label="Search Filters">
      {windowSize === 'small' && <SearchFiltersMobile {...sharedProps} />}
      {windowSize !== 'small' && <SearchFiltersDesktop {...sharedProps} />}
    </section>
  ) : (
    <SearchFiltersDesktop {...sharedProps} />
  );
};

export { SearchFilters as default, DateRangeFilter };
