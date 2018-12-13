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
      pathname: `/workv2`,
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
  workType = ['k', 'q'],
  itemsLocationsLocationType = ['iiif-image']
}: WorksUrlProps): NextLinkType {
  const workTypeWithDefaults =
    JSON.stringify(workType) === JSON.stringify(['k', 'q'])
      ? undefined : workType.join(',');

  const itemsLocationsLocationTypeWithDefaults =
    JSON.stringify(itemsLocationsLocationType) === JSON.stringify(['iiif-image'])
      ? undefined : itemsLocationsLocationType.join(',');

  return {
    href: {
      pathname: `/worksv2`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        workType: workTypeWithDefaults,
        'items.locations.locationType': itemsLocationsLocationTypeWithDefaults
      })
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        workType: workTypeWithDefaults,
        'items.locations.locationType': itemsLocationsLocationTypeWithDefaults
      })
    }
  };
}
