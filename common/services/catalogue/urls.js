// @flow
import type { NextLinkType } from '@weco/common/model/next-link-type';

const QueryTypes = {
  Justboost: 'boost',
  Broaderboost: 'msm',
  Slop: 'msmboost',
};
type QueryType = $Values<typeof QueryTypes>;
type GenericLinkProps = {|
  fromComponent?: string,
|};

type WorksUrlProps = {|
  ...GenericLinkProps,
  query: ?string,
  page: ?number,
  workType?: ?(string[]),
  itemsLocationsLocationType?: ?(string[]),
  _queryType?: ?QueryType,
|};

type WorkUrlProps = {|
  ...GenericLinkProps,
  id: string,
|};

type ItemUrlProps = {|
  ...GenericLinkProps,
  workId: string,
  sierraId: ?string,
  langCode: string,
  canvas: number,
  page: ?number,
|};

function removeEmpty(obj: Object): Object {
  return JSON.parse(JSON.stringify(obj));
}

function getWorkType(workType: ?(string[])) {
  return {
    workType: workType ? workType.join(',') : undefined,
  };
}

export function workUrl({ id, fromComponent }: WorkUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/work`,
      query: {
        id,
        fromComponent: fromComponent || undefined,
      },
    },
    as: {
      pathname: `/works/${id}`,
      fromComponent: fromComponent || undefined,
    },
  };
}

export function worksUrl({
  query,
  page,
  workType,
  _queryType,
  fromComponent,
}: WorksUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...getWorkType(workType),
        _queryType: _queryType && _queryType !== '' ? _queryType : undefined,
        fromComponent: fromComponent || undefined,
      }),
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...getWorkType(workType),
        _queryType: _queryType && _queryType !== '' ? _queryType : undefined,
        fromComponent: fromComponent || undefined,
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
  fromComponent,
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
          fromComponent: fromComponent || undefined,
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
        fromComponent: fromComponent || undefined,
      }),
    },
  };
}
