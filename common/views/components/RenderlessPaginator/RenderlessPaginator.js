// @flow
import { Fragment, type Node } from 'react';
import { type NextLinkType } from '@weco/common/model/next-link-type';

export type PaginatorRenderFunctionProps = {|
  currentPage: number,
  totalPages: number,
  prevLink: ?NextLinkType,
  nextLink: ?NextLinkType,
  rangeStart: number,
  rangeEnd: number,
|};

export type PropsWithoutRenderFunction = {|
  currentPage: number,
  pageSize: number,
  totalResults: number,
  link: NextLinkType,
  linkKey?: string,
|};
export type Props = {|
  ...PropsWithoutRenderFunction,
  render: (data: PaginatorRenderFunctionProps) => Node,
|};

const Paginator = ({
  currentPage,
  pageSize,
  totalResults,
  link,
  linkKey = 'page',
  render,
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
            [linkKey]: prev,
          },
        },
        as: {
          ...link.as,
          query: {
            ...link.as.query,
            [linkKey]: prev,
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
            [linkKey]: next,
          },
        },
        as: {
          ...link.as,
          query: {
            ...link.as.query,
            [linkKey]: next,
          },
        },
      }
    : null;

  return (
    <Fragment>
      {render({
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
export default Paginator;
