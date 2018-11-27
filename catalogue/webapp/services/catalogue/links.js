// @flow
type WorkLinkProps = {|
  id: string,
  query: ?string,
  page: ?number
|}

type WorksLinkProps = {|
  query: ?string,
  page: ?number
|}

type Link = {|
  pathname: string,
  query: Object
|}

type LinkProps = {|
  href: Link,
  as: Link
|}

function removeEmpty(obj: Object): Object {
  return JSON.parse(JSON.stringify(obj));
}

export function workLink({ id, query, page }: WorkLinkProps): LinkProps {
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

export function worksLink({ query, page }: WorksLinkProps): LinkProps {
  return {
    href: {
      pathname: `/works`,
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
