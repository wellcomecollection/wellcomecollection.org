// @flow
import type {NextLinkType} from '@weco/common/model/next-link-type';

type WorkUrlProps = {|
  id: string,
  query: ?string,
  page: ?number
|}

type WorksUrlProps = {|
  query: ?string,
  page: ?number,
  workType?: string[],
  itemsLocationsLocationType?: string[]
|}

function removeEmpty(obj: Object): Object {
  return JSON.parse(JSON.stringify(obj));
}

export function workUrl({ id, query, page }: WorkUrlProps): NextLinkType {
  return {
    href: {
      pathname: `/work`,
      query: {
        id,
        ...removeEmpty({
          query: query || undefined,
          page: page && page > 1 ? page : undefined
        })
      }
    },
    as: {
      pathname: `/works/${id}`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined
      })
    }
  };
}

export function worksUrl({
  query,
  page,
  workType,
  itemsLocationsLocationType
}: WorksUrlProps): NextLinkType {
  const isDefaultWorkType = JSON.stringify(workType) === JSON.stringify(['k', 'q']);
  const isDefaultItemsLocationsLocationType = JSON.stringify(itemsLocationsLocationType) === JSON.stringify(['iiif-image']);
  return {
    href: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        workType: workType && !isDefaultWorkType ? workType.join(',') : undefined,
        'items.locations.locationType': itemsLocationsLocationType && !isDefaultItemsLocationsLocationType ? itemsLocationsLocationType.join(',') : undefined
      })
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        workType: workType && !isDefaultWorkType ? workType.join(',') : undefined,
        'items.locations.locationType': itemsLocationsLocationType && !isDefaultItemsLocationsLocationType ? itemsLocationsLocationType.join(',') : undefined
      })
    }
  };
}
