import { FunctionComponent, ReactElement, useContext, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';
import SearchFiltersDesktop from './SearchFiltersDesktop';
import SearchFiltersMobile from './SearchFiltersMobile';
import { LinkProps } from '../../../model/link-props';
import { Filter } from '../../../services/catalogue/filters';
import { AppContext } from '../AppContext/AppContext';
import useIsomorphicLayoutEffect from '../../../hooks/useIsomorphicLayoutEffect';

type Props = {
  query: string;
  searchFormId?: string;
  changeHandler: () => void;
  filters: Filter[];
  linkResolver: (params: ParsedUrlQuery) => LinkProps;
  isNewStyle?: boolean;
};

export type SearchFiltersSharedProps = Props & { activeFiltersCount: number };

const SearchFilters: FunctionComponent<Props> = ({
  query,
  searchFormId,
  changeHandler,
  filters,
  linkResolver,
  isNewStyle,
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
    isNewStyle,
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

export default SearchFilters;
