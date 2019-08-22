// @flow
import type { NextLinkType } from '@weco/common/model/next-link-type';

const QueryTypes = {
  Justboost: 'boost',
  Broaderboost: 'msm',
  Slop: 'msmboost',
};
type QueryType = $Values<typeof QueryTypes>;

type WorksUrlProps = {|
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
|};

type ItemUrlProps = {|
  workId: string,
  sierraId: ?string,
  langCode: string,
  canvas: number,
  page: ?number,
  isOverview?: boolean,
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

export function workUrl({ id }: WorkUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/work`,
      query: {
        id,
      },
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
        _queryType: _queryType && _queryType !== '' ? _queryType : undefined,
        _dateFrom: _dateFrom,
        _dateTo: _dateTo,
        _isFilteringBySubcategory: _isFilteringBySubcategory,
      }),
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...getWorkType(workType),
        _queryType: _queryType && _queryType !== '' ? _queryType : undefined,
        _dateFrom: _dateFrom,
        _dateTo: _dateTo,
        _isFilteringBySubcategory: _isFilteringBySubcategory,
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
