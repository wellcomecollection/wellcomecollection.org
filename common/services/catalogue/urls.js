// @flow
import type { NextLinkType } from '@weco/common/model/next-link-type';

const QueryTypes = {
  justboost: 'justboost',
  broaderboost: 'broaderboost',
  slop: 'slop',
  minimummatch: 'minimummatch',
};
type QueryType = $Values<typeof QueryTypes>;

type WorksUrlProps = {|
  query: ?string,
  page: ?number,
  workType?: ?(string[]),
  itemsLocationsLocationType?: ?(string[]),
  _queryType?: ?QueryType,
|};

type WorkUrlProps = {|
  id: string,
|};

type ItemUrlProps = {|
  workId: string,
  sierraId: string,
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
}: WorksUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...getWorkType(workType),
        _queryType: _queryType && _queryType !== '' ? _queryType : undefined,
      }),
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...getWorkType(workType),
        _queryType: _queryType && _queryType !== '' ? _queryType : undefined,
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
