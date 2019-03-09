// @flow
import type { NextLinkType } from '@weco/common/model/next-link-type';

type WorksUrlProps = {|
  query: ?string,
  page: ?number,
  workType?: ?(string[]),
  itemsLocationsLocationType?: ?(string[]),
  queryType?: ?string,
|};

type WorkUrlProps = {|
  ...WorksUrlProps,
  id: string,
|};

type ItemUrlProps = {|
  ...WorksUrlProps,
  workId: string,
  sierraId: string,
  canvas: number,
|};

function removeEmpty(obj: Object): Object {
  return JSON.parse(JSON.stringify(obj));
}

function workTypeAndItemsLocationType(
  workType: ?(string[]),
  itemsLocationsLocationType: ?(string[])
) {
  return {
    workType: workType ? workType.join(',') : undefined,
    'items.locations.locationType': itemsLocationsLocationType
      ? itemsLocationsLocationType.join(',')
      : undefined,
  };
}

export function workUrl({
  id,
  query,
  page,
  workType,
  itemsLocationsLocationType,
  queryType,
}: WorkUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/work`,
      query: {
        id,
        ...removeEmpty({
          query: query || undefined,
          page: page && page > 1 ? page : undefined,
          ...workTypeAndItemsLocationType(workType, itemsLocationsLocationType),
          queryType: queryType && queryType !== '' ? queryType : undefined,
        }),
      },
    },
    as: {
      pathname: `/works/${id}`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...workTypeAndItemsLocationType(workType, itemsLocationsLocationType),
        queryType: queryType && queryType !== '' ? queryType : undefined,
      }),
    },
  };
}

export function worksUrl({
  query,
  page,
  workType,
  itemsLocationsLocationType,
  queryType,
}: WorksUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...workTypeAndItemsLocationType(workType, itemsLocationsLocationType),
        queryType: queryType && queryType !== '' ? queryType : undefined,
      }),
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...workTypeAndItemsLocationType(workType, itemsLocationsLocationType),
        queryType: queryType && queryType !== '' ? queryType : undefined,
      }),
    },
  };
}

export function itemUrl({
  workId,
  query,
  page,
  workType,
  itemsLocationsLocationType,
  sierraId,
  canvas,
}: ItemUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/item`,
      query: {
        workId,
        ...removeEmpty({
          query: query || undefined,
          page: page && page > 1 ? page : undefined,
          canvas: canvas && canvas > 1 ? canvas : undefined,
          sierraId: sierraId,
          ...workTypeAndItemsLocationType(workType, itemsLocationsLocationType),
        }),
      },
    },
    as: {
      pathname: `/works/${workId}/items`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        canvas: canvas && canvas > 1 ? canvas : undefined,
        sierraId: sierraId,
        ...workTypeAndItemsLocationType(workType, itemsLocationsLocationType),
      }),
    },
  };
}
