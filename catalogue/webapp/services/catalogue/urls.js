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
  workType,
  itemsLocationsLocationType
}: WorksUrlProps): LinkProps {
  return {
    href: {
      pathname: `/worksv2`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        workType: workType ? workType.join(',') : undefined,
        'items.locations.locationType': itemsLocationsLocationType ? itemsLocationsLocationType.join(',') : undefined
      })
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined,
        workType: workType ? workType.join(',') : undefined,
        'items.locations.locationType': itemsLocationsLocationType ? itemsLocationsLocationType.join(',') : undefined
      })
    }
  };
}
