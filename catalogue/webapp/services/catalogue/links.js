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
      query: { id, query, page }
    },
    as: {
      pathname: `/works/${id}`,
      query: removeEmpty({ query, page })
    }
  };
}

export function worksLink({ query, page }: WorksLinkProps): LinkProps {
  return {
    href: {
      pathname: `/works`,
      query: { query, page }
    },
    as: {
      pathname: `/works`,
      query: removeEmpty({ query, page })
    }
  };
}

export function workV2Link({ id, query, page }: WorkLinkProps): LinkProps {
  return {
    href: {
      pathname: `/workv2`,
      query: { id, query, page }
    },
    as: {
      pathname: `/worksv2/${id}`,
      query: removeEmpty({ query, page })
    }
  };
}

export function worksV2Link({ query, page }: WorksLinkProps): LinkProps {
  return {
    href: {
      pathname: `/worksv2`,
      query: { query, page }
    },
    as: {
      pathname: `/worksv2`,
      query: removeEmpty({ query, page })
    }
  };
}
