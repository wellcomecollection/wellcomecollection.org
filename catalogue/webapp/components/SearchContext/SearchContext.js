// @flow
import {
  type Node,
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import Router from 'next/router';
import { type NextLinkType } from '@weco/common/model/next-link-type';
import { worksUrl } from '@weco/common/services/catalogue/urls';

type QueryType = 'justboost' | 'broaderboost' | 'slop' | 'minimummatch';

export type CatalogueQuery = {|
  query: string,
  page: number,
  workType: ?(string[]),
  itemsLocationsLocationType: ?(string[]),
  queryType: ?QueryType,
|};

type ContextProps = {|
  ...CatalogueQuery,
  setQuery: (value: string) => void,
  setPage: (value: number) => void,
  setWorkType: (value: ?(string[])) => void,
  setItemsLocationsLocationType: (value: ?(string[])) => void,
  setQueryType: (value: ?QueryType) => void,
  worksLink: NextLinkType,
|};

const defaultState: CatalogueQuery = {
  query: '',
  page: 1,
  workType: ['k', 'q'],
  itemsLocationsLocationType: ['iiif-image'],
  queryType: null,
};

const SearchContext = createContext<ContextProps>({
  ...defaultState,
  setQuery: () => {},
  setPage: () => {},
  setWorkType: () => {},
  setItemsLocationsLocationType: () => {},
  setQueryType: () => {},
  worksLink: worksUrl({ ...defaultState }),
});

type SearchProviderProps = {
  initialState: $Shape<CatalogueQuery>,
  children: Node,
};

const SearchProvider = ({ initialState, children }: SearchProviderProps) => {
  const state = {
    ...defaultState,
    ...initialState,
  };
  const [query, setQuery] = useState(state.query);
  const [page, setPage] = useState(state.page);
  const [workType, setWorkType] = useState(state.workType);
  const [itemsLocationsLocationType, setItemsLocationsLocationType] = useState(
    state.itemsLocationsLocationType
  );
  const [queryType, setQueryType] = useState(state.queryType);
  const [worksLink, setWorksLink] = useState(worksUrl({ ...state }));

  useEffect(() => {
    setWorksLink(
      worksUrl({
        query,
        page,
        workType,
        itemsLocationsLocationType,
        queryType,
      })
    );
  }, [query, page, workType, itemsLocationsLocationType, queryType]);

  const value = {
    query,
    page,
    workType,
    itemsLocationsLocationType,
    queryType,
    setQuery,
    setPage,
    setWorkType,
    setItemsLocationsLocationType,
    setQueryType,
    worksLink,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

type SearchRouterProps = {|
  children: (searchRouter: any) => Node,
|};

const SearchRouter = ({ children }: SearchRouterProps) => {
  const {
    query,
    page,
    workType,
    itemsLocationsLocationType,
    queryType,
  } = useContext(SearchContext);
  const push = () => {
    const link = worksUrl({
      query,
      page,
      workType: workType,
      itemsLocationsLocationType: itemsLocationsLocationType,
      queryType: queryType,
    });
    Router.push(
      { ...link.href, pathname: '/works-context' },
      { ...link.as, pathname: '/works-context' }
    );
  };
  return children({ push });
};

export default SearchContext;
export { SearchProvider, SearchRouter };
