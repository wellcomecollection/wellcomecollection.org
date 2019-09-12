// @flow
import { type Node, createContext, useContext } from 'react';
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
  _isFilteringBySubcategory: ?string,
|};

const defaultState: CatalogueQuery = {
  query: '',
  page: 1,
  workType: null,
  itemsLocationsLocationType: null,
  _queryType: null,
  _dateFrom: null,
  _dateTo: null,
  _isFilteringBySubcategory: null,
};

const CatalogueSearchContext = createContext<CatalogueQuery>({
  ...defaultState,
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
    query: router.query.query ? router.query.query : defaultState.query,
    page: router.query.page
      ? parseInt(router.query.page, 10)
      : defaultState.page,
    workType: router.query.workType
      ? router.query.workType.split(',')
      : defaultState.workType,
    itemsLocationsLocationType: router.query['items.locations.locationType']
      ? router.query['items.locations.locationType'].split(',')
      : defaultState.itemsLocationsLocationType,
    _dateFrom: router.query._dateFrom
      ? router.query._dateFrom
      : defaultState._dateFrom,
    _dateTo: router.query._dateTo ? router.query._dateTo : defaultState._dateTo,
    _isFilteringBySubcategory: router.query._isFilteringBySubcategory
      ? router.query._isFilteringBySubcategory
      : defaultState._isFilteringBySubcategory,
  };

  const state = {
    ...defaultState,
    ...initialState,
  };

  console.log(state);

  return (
    <CatalogueSearchContext.Provider value={state}>
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
    _isFilteringBySubcategory,
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
      _isFilteringBySubcategory,
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
