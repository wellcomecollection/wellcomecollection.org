// @flow
import { Fragment, type Node } from 'react';
import { type NextLinkType } from '@weco/common/model/next-link-type';

type PaginatorRenderFunctionProps = {|
  currentPage: number,
  totalPages: number,
  prevLink: ?NextLinkType,
  nextLink: ?NextLinkType,
  rangeStart: number,
  rangeEnd: number,
|};

type Props = {|
  currentPage: number,
  pageSize: number,
  totalResults: number,
  link: NextLinkType,
  render: (data: PaginatorRenderFunctionProps) => Node,
|};

const Paginator = ({
  currentPage,
  pageSize,
  totalResults,
  link,
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
