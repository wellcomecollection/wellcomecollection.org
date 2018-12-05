// @flow
import type {Url} from '@weco/common/model/url';

type WorkLinkProps = {|
  id: string,
  query: ?string,
  page: ?number
|}

type WorksLinkProps = {|
  query: ?string,
  page: ?number
|}

type LinkProps = {|
  href: Url,
  as: Url
|}

function removeEmpty(obj: Object): Object {
  return JSON.parse(JSON.stringify(obj));
}

export function workUrl({ id, query, page }: WorkLinkProps): LinkProps {
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

export function worksUrl({ query, page }: WorksLinkProps): LinkProps {
  return {
    href: {
      pathname: `/worksv2`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined
      })
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({
        query: query || undefined,
        page: page && page > 1 ? page : undefined
      })
    }
  };
}
