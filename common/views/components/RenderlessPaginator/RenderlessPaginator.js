// @flow
import { Fragment, type Node as ReactNode } from 'react';

type Link = {|
  +pathname: string,
  +query: Object,
|};

type LinkProps = {|
  href: Link,
  as: Link,
|};

type Props = {|
  currentPage: number,
  pageSize: number,
  totalResults: number,
  link: LinkProps,
  children: ({|
    currentPage: number,
    totalPages: number,
    prevLink: any, // FIXME: ?Link
    nextLink: any, // FIXME: ?Link
    rangeStart: number,
    rangeEnd: number,
  |}) => ReactNode,
|};

const RenderlessPaginator = ({
  currentPage,
  pageSize,
  totalResults,
  link,
  children,
}: Props) => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const next = currentPage < totalPages ? currentPage + 1 : null;
  const prev = currentPage > 1 ? currentPage - 1 : null;
  const rangeStart = pageSize * currentPage - (pageSize - 1);
  const rangeEnd =
    pageSize * currentPage > totalResults
      ? totalResults
      : pageSize * currentPage;

  const prevLink = prev
    ? {
        href: {
          ...link.href,
          query: {
            ...link.href.query,
            page: prev,
          },
        },
        as: {
          ...link.as,
          query: {
            ...link.as.query,
            page: prev,
          },
        },
      }
    : null;

  const nextLink = next
    ? {
        href: {
          ...link.href,
          query: {
            ...link.href.query,
            page: next,
          },
        },
        as: {
          ...link.as,
          query: {
            ...link.as.query,
            page: next,
          },
        },
      }
    : null;

  return (
    <Fragment>
      {children({
        currentPage,
        totalPages,
        prevLink,
        nextLink,
        rangeStart,
        rangeEnd,
      })}
    </Fragment>
  );
};
export default RenderlessPaginator;
