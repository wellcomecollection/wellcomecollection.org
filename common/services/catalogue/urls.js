// @flow
import type { NextLinkType } from '@weco/common/model/next-link-type';
import Router from 'next/router';

const QueryTypes = {
  Justboost: 'boost',
  Broaderboost: 'msm',
  Slop: 'msmboost',
};
type QueryType = $Values<typeof QueryTypes>;

export type WorksUrlProps = {|
  query: ?string,
  page: ?number,
  workType?: ?(string[]),
  itemsLocationsLocationType?: ?(string[]),
  _queryType?: ?QueryType,
  _dateFrom?: ?string,
  _dateTo?: ?string,
  _isFilteringBySubcategory?: ?string,
|};

type WorkUrlProps = {|
  id: string,
  ...WorksUrlProps,
|};

type ItemUrlProps = {|
  workId: string,
  sierraId: ?string,
  langCode: string,
  canvas: number,
  page: ?number,
  isOverview?: boolean,
  ...WorksUrlProps,
|};

type downloadUrlProps = {|
  workId: string,
  sierraId: ?string,
|};

function removeEmpty(obj: Object): Object {
  return JSON.parse(JSON.stringify(obj));
}

function getWorkType(workType: ?(string[])) {
  return {
    workType: workType ? workType.join(',') : undefined,
  };
}

function getLocationType(locationType: ?(string[])) {
  return {
    'items.locations.locationType': locationType
      ? locationType.join(',')
      : undefined,
  };
}

export function workUrl({
  id,
  query,
  page,
  workType,
  _queryType,
  _dateFrom,
  _dateTo,
  _isFilteringBySubcategory,
}: WorkUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/work`,
      query: removeEmpty({
        id,
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...getWorkType(workType),
        _queryType: _queryType && _queryType !== '' ? _queryType : undefined,
        _dateFrom: _dateFrom && _dateFrom !== '' ? _dateFrom : undefined,
        _dateTo: _dateTo && _dateTo !== '' ? _dateTo : undefined,
        _isFilteringBySubcategory:
          _isFilteringBySubcategory && _isFilteringBySubcategory !== ''
            ? _isFilteringBySubcategory
            : undefined,
      }),
    },
    as: {
      pathname: `/works/${id}`,
    },
  };
}

export function worksUrl({
  query,
  page,
  workType,
  itemsLocationsLocationType,
  _queryType,
  _dateFrom,
  _dateTo,
  _isFilteringBySubcategory,
}: WorksUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...getWorkType(workType),
        ...getLocationType(itemsLocationsLocationType),
        _queryType: _queryType && _queryType !== '' ? _queryType : undefined,
        _dateFrom: _dateFrom && _dateFrom !== '' ? _dateFrom : undefined,
        _dateTo: _dateTo && _dateTo !== '' ? _dateTo : undefined,
        _isFilteringBySubcategory:
          _isFilteringBySubcategory && _isFilteringBySubcategory !== ''
            ? _isFilteringBySubcategory
            : undefined,
      }),
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...getWorkType(workType),
        ...getLocationType(itemsLocationsLocationType),
        _queryType: _queryType && _queryType !== '' ? _queryType : undefined,
        _dateFrom: _dateFrom && _dateFrom !== '' ? _dateFrom : undefined,
        _dateTo: _dateTo && _dateTo !== '' ? _dateTo : undefined,
        _isFilteringBySubcategory:
          _isFilteringBySubcategory && _isFilteringBySubcategory !== ''
            ? _isFilteringBySubcategory
            : undefined,
      }),
    },
  };
}

export function itemUrl({
  workId,
  page,
  sierraId,
  langCode,
  canvas,
  isOverview,
  query,
  workType,
  _queryType,
  _dateFrom,
  _dateTo,
  _isFilteringBySubcategory,
}: ItemUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/item`,
      query: {
        workId,
        ...removeEmpty({
          page: page && page > 1 ? page : undefined,
          canvas: canvas && canvas > 1 ? canvas : undefined,
          sierraId: sierraId,
          langCode: langCode,
          isOverview: isOverview,
          query: query || undefined,
          ...getWorkType(workType),
          _queryType: _queryType && _queryType !== '' ? _queryType : undefined,
          _dateFrom: _dateFrom && _dateFrom !== '' ? _dateFrom : undefined,
          _dateTo: _dateTo && _dateTo !== '' ? _dateTo : undefined,
          _isFilteringBySubcategory:
            _isFilteringBySubcategory && _isFilteringBySubcategory !== ''
              ? _isFilteringBySubcategory
              : undefined,
        }),
      },
    },
    as: {
      pathname: `/works/${workId}/items`,
      query: removeEmpty({
        page: page && page > 1 ? page : undefined,
        canvas: canvas && canvas > 1 ? canvas : undefined,
        sierraId: sierraId,
        langCode: langCode,
      }),
    },
  };
}

export function downloadUrl({
  workId,
  sierraId,
}: downloadUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/download`,
      query: {
        workId,
        ...removeEmpty({
          sierraId: sierraId,
        }),
      },
    },
    as: {
      pathname: `/works/${workId}/download`,
      query: removeEmpty({
        sierraId: sierraId,
      }),
    },
  };
}

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

export function searchQueryParams() {
  if (typeof window !== 'undefined') {
    return {
      query: Router.query.query ? Router.query.query : defaultState.query,
      page: Router.query.page
        ? parseInt(Router.query.page, 10)
        : defaultState.page,
      workType: Router.query.workType
        ? Router.query.workType.split(',')
        : defaultState.workType,
      itemsLocationsLocationType: Router.query['items.locations.locationType']
        ? Router.query['items.locations.locationType'].split(',')
        : defaultState.itemsLocationsLocationType,
      _dateFrom: Router.query._dateFrom
        ? Router.query._dateFrom
        : defaultState._dateFrom,
      _dateTo: Router.query._dateTo
        ? Router.query._dateTo
        : defaultState._dateTo,
      _isFilteringBySubcategory: Router.query._isFilteringBySubcategory
        ? Router.query._isFilteringBySubcategory
        : defaultState._isFilteringBySubcategory,
      _queryType: Router.query._queryType || defaultState._queryType,
    };
  } else {
    return defaultState;
  }
}
