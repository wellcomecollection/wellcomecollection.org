// @flow
import type { NextLinkType } from '@weco/common/model/next-link-type';

type WorksUrlProps = {|
  query: ?string,
  page: ?number,
  workType?: ?(string[]),
  itemsLocationsLocationType?: ?(string[]),
|};

type WorkUrlProps = {|
  ...WorksUrlProps,
  id: string,
|};

type ItemUrlProps = {|
  ...WorksUrlProps,
  workId: string,
  sierraId: string,
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
        }),
      },
    },
    as: {
      pathname: `/works/${id}`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...workTypeAndItemsLocationType(workType, itemsLocationsLocationType),
      }),
    },
  };
}

export function worksUrl({
  query,
  page,
  workType,
  itemsLocationsLocationType,
}: WorksUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...workTypeAndItemsLocationType(workType, itemsLocationsLocationType),
      }),
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        ...workTypeAndItemsLocationType(workType, itemsLocationsLocationType),
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
}: ItemUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/item`,
      query: {
        workId,
        ...removeEmpty({
          query: query || undefined,
          page: page && page > 1 ? page : undefined,
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
        sierraId: sierraId,
        ...workTypeAndItemsLocationType(workType, itemsLocationsLocationType),
      }),
    },
  };
}
