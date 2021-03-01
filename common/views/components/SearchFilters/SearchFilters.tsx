import { useState, FunctionComponent, ReactElement } from 'react';
import { ParsedUrlQuery } from 'querystring';
import SearchFiltersDesktop from '../SearchFiltersDesktop/SearchFiltersDesktop';
import SearchFiltersMobile from '../SearchFiltersMobile/SearchFiltersMobile';
import { LinkProps } from '../../../model/link-props';
import { Filter } from '../../../services/catalogue/filters';

type Props = {
  query: string;
  searchForm: { current: HTMLFormElement | null };
  changeHandler: () => void;
  filters: Filter[];
  linkResolver: (params: ParsedUrlQuery) => LinkProps;
};

export type SearchFiltersSharedProps = Props;

const SearchFilters: FunctionComponent<Props> = ({
  query,
  searchForm,
  changeHandler,
  filters,
  linkResolver,
}: Props): ReactElement<Props> => {
  const [isMobile] = useState(false);

  const sharedProps: SearchFiltersSharedProps = {
    query,
    searchForm,
    changeHandler,
    filters,
    linkResolver,
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
