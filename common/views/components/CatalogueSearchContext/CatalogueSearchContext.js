// @flow
import {
  type Node,
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import Router, { withRouter } from 'next/router';
import { worksUrl } from '@weco/common/services/catalogue/urls';

export type CatalogueQuery = {|
  query: string,
  page: number,
  workType: ?(string[]),
  itemsLocationsLocationType: ?(string[]),
  queryType: ?string,
|};

type ContextProps = {|
  ...CatalogueQuery,
  setQuery: (value: string) => void,
  setPage: (value: number) => void,
  setWorkType: (value: ?(string[])) => void,
  setItemsLocationsLocationType: (value: ?(string[])) => void,
  setQueryType: (value: ?string) => void,
|};

const defaultState: CatalogueQuery = {
  query: '',
  page: 1,
  workType: null,
  itemsLocationsLocationType: null,
  queryType: null,
};

const CatalogueSearchContext = createContext<ContextProps>({
  ...defaultState,
  setQuery: () => {},
  setPage: () => {},
  setWorkType: () => {},
  setItemsLocationsLocationType: () => {},
  setQueryType: () => {},
});

type CatalogueSearchProviderProps = {
  children: Node,
};

const CatalogueSearchProvider = ({
  children,
  router,
}: {
  ...CatalogueSearchProviderProps,
  router: any,
}) => {
  const initialState = {
    query: router.query.query ? router.query.query : '',
    page: router.query.page ? parseInt(router.query.page, 10) : 1,
    workType: router.query.workType ? router.query.workType.split(',') : null,
    itemsLocationsLocationType: router.query['items.locations.locationType']
      ? router.query['items.locations.locationType'].split(',')
      : null,
  };
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
  };

  useEffect(() => {
    function routeChangeComplete(url: string) {
      const [path, query = ''] = url.split('?');

      // TODO: There must be a more non-stringy way to do this
      // This avoids other URL updates changing the search context
      if (path === '/works') {
        const params = query.split('&').reduce((acc, keyAndVal) => {
          const [key, value] = keyAndVal.split('=');
          const decodedValue = decodeURIComponent(value);
          const val =
            key === 'workType' || key === 'items.locations.location.type'
              ? decodedValue.split(',')
              : decodedValue;

          return {
            ...acc,
            [key === 'items.locations.location.type'
              ? 'itemsLocationsLocationType'
              : key]: val,
          };
        }, {});
        const state = {
          ...defaultState,
          ...params,
        };

        setQuery(state.query);
        setPage(parseInt(state.page, 10));
        setWorkType(state.workType);
        setItemsLocationsLocationType(
          (state.itemsLocationsLocationType: string[])
        );
        setQueryType(state.queryType);
      }
    }

    Router.events.on('routeChangeComplete', routeChangeComplete);
    return () => {
      Router.events.off('routeChangeComplete', routeChangeComplete);
    };
  }, []);

  return (
    <CatalogueSearchContext.Provider value={value}>
      {children}
    </CatalogueSearchContext.Provider>
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
  } = useContext(CatalogueSearchContext);
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

const RoutedCatalogueSearchProvider = withRouter<CatalogueSearchProviderProps>(
  CatalogueSearchProvider
);
export default CatalogueSearchContext;
export { SearchRouter };
export { RoutedCatalogueSearchProvider as CatalogueSearchProvider };
