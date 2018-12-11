// @flow
import type {Url} from '@weco/common/model/url';

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

type LinkProps = {|
  href: Url,
  as: Url
|}

function removeEmpty(obj: Object): Object {
  return JSON.parse(JSON.stringify(obj));
}

export function workUrl({ id, query, page }: WorkUrlProps): LinkProps {
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
}: WorksUrlProps): LinkProps {
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
