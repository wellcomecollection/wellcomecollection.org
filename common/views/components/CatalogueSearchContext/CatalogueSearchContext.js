// @flow
import {
  type Node,
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import Router, { withRouter } from 'next/router';
import { worksUrl } from '../../../services/catalogue/urls';

export type CatalogueQuery = {|
  query: string,
  page: number,
  workType: ?(string[]),
  itemsLocationsLocationType: ?(string[]),
  _queryType: ?string,
  _dateFrom: ?string,
  _dateTo: ?string,
|};

type ContextProps = {|
  ...CatalogueQuery,
  setQuery: (value: string) => void,
  setPage: (value: number) => void,
  setWorkType: (value: ?(string[])) => void,
  setItemsLocationsLocationType: (value: ?(string[])) => void,
  setQueryType: (value: ?string) => void,
  setDateFrom: (value: ?string) => void,
  setDateTo: (value: ?string) => void,
|};

const defaultState: CatalogueQuery = {
  query: '',
  page: 1,
  workType: null,
  itemsLocationsLocationType: null,
  _queryType: null,
  _dateFrom: null,
  _dateTo: null,
};

const CatalogueSearchContext = createContext<ContextProps>({
  ...defaultState,
  setQuery: () => {},
  setPage: () => {},
  setWorkType: () => {},
  setItemsLocationsLocationType: () => {},
  setQueryType: () => {},
  setDateFrom: () => {},
  setDateTo: () => {},
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
    _dateFrom: router.query._dateFrom ? router.query._dateFrom : null,
    _dateTo: router.query._dateTo ? router.query._dateTo : null,
  };
  const state = {
    ...defaultState,
    ...initialState,
  };

  const [query, setQuery] = useState(state.query);
  const [page, setPage] = useState(state.page);
  const [workType, setWorkType] = useState(state.workType);
  const [_dateFrom, setDateFrom] = useState(state._dateFrom);
  const [_dateTo, setDateTo] = useState(state._dateTo);
  const [itemsLocationsLocationType, setItemsLocationsLocationType] = useState(
    state.itemsLocationsLocationType
  );
  const [_queryType, setQueryType] = useState(state._queryType);
  const value = {
    query,
    page,
    workType,
    itemsLocationsLocationType,
    _queryType,
    _dateFrom,
    _dateTo,
    setQuery,
    setPage,
    setWorkType,
    setItemsLocationsLocationType,
    setQueryType,
    setDateFrom,
    setDateTo,
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

          return {
            ...acc,
            [key]: decodedValue,
          };
        }, {});

        const state = {
          ...defaultState,
          query: params.query || defaultState.query,
          page: params.page || defaultState.page,
          workType: params.workType
            ? params.workType.split(',')
            : defaultState.workType,
          // $FlowFixMe
          itemsLocationsLocationType: params['items.locations.location.type']
            ? params['items.locations.location.type'].split(',')
            : defaultState.itemsLocationsLocationType,
          _queryType: params._queryType || defaultState._queryType,
          _dateFrom: params._dateFrom || null,
          _dateTo: params._dateTo || null,
        };

        setQuery(state.query);
        setPage(parseInt(state.page, 10));
        setWorkType(state.workType);
        setItemsLocationsLocationType(state.itemsLocationsLocationType);
        setQueryType(state._queryType);
        setDateFrom(state._dateFrom);
        setDateTo(state._dateTo);
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
    _queryType,
    _dateFrom,
    _dateTo,
  } = useContext(CatalogueSearchContext);
  const push = () => {
    const link = worksUrl({
      query,
      page,
      workType,
      itemsLocationsLocationType,
      _queryType,
      _dateFrom,
      _dateTo,
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
