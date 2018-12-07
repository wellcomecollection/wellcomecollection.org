// @flow
import {Fragment} from 'react';
import NextLink from 'next/link';
import {classNames, font, spacing} from '../../../utils/classnames';
import Control from '../Buttons/Control/Control';

type Link = {|
  pathname: string,
  query: Object,
|}

type LinkProps = {|
  href: Link,
  as: Link
|}

type PageChangeFunction = (event: Event, page: number) => Promise<void>

type Props = {|
  currentPage: number,
  pageSize: number,
  totalResults: number,
  link: LinkProps,
  onPageChange: PageChangeFunction
|}

const Paginator = ({
  currentPage,
  pageSize,
  totalResults,
  link,
  onPageChange
}: Props) => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const next = currentPage < totalPages ? currentPage + 1 : null;
  const prev = currentPage > 1 ? currentPage - 1 : null;
  const rangeStart = (pageSize * currentPage) - (pageSize - 1);
  const rangeEnd = (pageSize * currentPage);

  const prevLink = prev ? {
    href: {
      ...link.href,
      query: {
        ...link.href.query,
        page: prev
      }
    },
    as: {
      ...link.as,
      query: {
        ...link.as.query,
        page: prev
      }
    }
  } : null;

  const nextLink = next ? {
    href: {
      ...link.href,
      query: {
        ...link.href.query,
        page: next
      }
    },
    as: {
      ...link.as,
      query: {
        ...link.as.query,
        page: next
      }
    }
  } : null;

  return (
    <Fragment>
      <div className={`flex flex--v-center font-pewter ${font({s: 'LR3', m: 'LR2'})}`}>
        Showing {rangeStart} - {rangeEnd}
      </div>
      <div className={classNames({
        'pagination': true,
        'float-r': true,
        'flex-inline': true,
        'flex--v-center': true,
        'font-pewter': true,
        [font({s: 'LR3', m: 'LR2'})]: true
      })}>
        {prev &&
          <NextLink {...prevLink}>
            <a onClick={(event) => {
              onPageChange(event, prev);
            }}>
              <Control
                type='light'
                extraClasses={`icon--180 ${spacing({s: 2}, {margin: ['right']})}`}
                icon='arrow'
                text={`Previous (page ${prev})`} />
            </a>
          </NextLink>
        }

        <span>Page {currentPage} of {totalPages}</span>

        {next &&
          <NextLink {...nextLink}>
            <a onClick={(event) => {
              onPageChange(event, next);
            }}>
              <Control
                type='light'
                extraClasses={`${spacing({s: 2}, {margin: ['left']})}`}
                icon='arrow'
                text={`Next (page ${next})`} />
            </a>
          </NextLink>
        }
      </div>
    </Fragment>
  );
};
export default Paginator;
