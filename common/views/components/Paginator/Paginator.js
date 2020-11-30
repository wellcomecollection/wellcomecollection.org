// @flow
import { Fragment } from 'react';
import { classNames, font } from '../../../utils/classnames';
import Control from '../Buttons/Control/Control';
import Space from '../styled/Space';
import styled from 'styled-components';
type Link = {|
  +pathname: string,
  +query: Object,
|};

type LinkProps = {|
  href: Link,
  as: Link,
|};

type PageChangeFunction = (event: Event, page: number) => Promise<void>;

type Props = {|
  query?: string,
  showPortal?: boolean,
  currentPage: number,
  pageSize: number,
  totalResults: number,
  link: LinkProps,
  onPageChange: PageChangeFunction,
  hideMobilePaging: boolean,
|};

const PaginatorWrapper = styled.div`
  @media (max-width: ${props => props.theme.sizes.medium}px) {
    display: ${props => (props.hideMobilePaging ? 'none' : 'block')};
  }
`;

const Paginator = ({
  query,
  showPortal,
  currentPage,
  pageSize,
  totalResults,
  link,
  onPageChange,
  hideMobilePaging,
}: Props) => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const next = currentPage < totalPages ? currentPage + 1 : null;
  const prev = currentPage > 1 ? currentPage - 1 : null;

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
      <Space
        h={{ size: 'm', properties: ['margin-right'] }}
        className={`flex flex--v-center ${font('hnm', 3)}`}
      >
        {totalResults} result{totalResults !== 1 ? 's' : ''}
        {query && ` for “${query}”`}
      </Space>
      <div
        className={classNames({
          pagination: true,
          'float-r': true,
          'flex-inline': true,
          'flex--v-center': true,
          'font-pewter': true,
          [font('hnl', 5)]: true,
        })}
      >
        {showPortal && <div id="sort-select-portal"></div>}
        <PaginatorWrapper hideMobilePaging={hideMobilePaging}>
          {prevLink && prev && (
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <Control
                link={prevLink}
                clickHandler={event => {
                  onPageChange(event, prev);
                }}
                type="light"
                extraClasses={classNames({
                  'icon--180': true,
                })}
                icon="arrow"
                text={`Previous (page ${prev})`}
              />
            </Space>
          )}
          <span>
            Page {currentPage} of {totalPages}
          </span>
          {nextLink && next && (
            <Space as="span" h={{ size: 'm', properties: ['margin-left'] }}>
              <Control
                link={nextLink}
                clickHandler={event => {
                  onPageChange(event, next);
                }}
                type="light"
                icon="arrow"
                text={`Next (page ${next})`}
              />
            </Space>
          )}
        </PaginatorWrapper>
      </div>
    </Fragment>
  );
};
export default Paginator;
