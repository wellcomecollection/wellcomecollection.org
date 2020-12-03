// @flow
import { Fragment } from 'react';
import { classNames, font } from '../../../utils/classnames';
// $FlowFixMe (tsx)
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
  hideMobilePagination?: boolean,
  hideMobileTotalResults?: boolean,
|};

const PaginatorWrapper = styled.div.attrs(props => ({
  className: classNames({
    'is-hidden-s': Boolean(props.hideMobilePagination),
    flex: true,
    'flex--v-center': true,
  }),
}))``;

const TotalResultsWrapper = styled.div.attrs(props => ({
  className: classNames({
    'is-hidden-s': Boolean(props.hideMobileTotalResults),
  }),
}))``;
const Paginator = ({
  query,
  showPortal,
  currentPage,
  pageSize,
  totalResults,
  link,
  onPageChange,
  hideMobilePagination,
  hideMobileTotalResults,
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
        className={classNames({
          flex: true,
          'flex--v-center': true,
          [font('hnm', 3)]: true,
        })}
      >
        <TotalResultsWrapper hideMobileTotalResults={hideMobileTotalResults}>
          {totalResults} result{totalResults !== 1 ? 's' : ''}
          {query && ` for “${query}”`}
        </TotalResultsWrapper>
      </Space>
      <Space
        className={classNames({
          pagination: true,
          'float-r': true,
          'flex-inline': true,
          'flex--v-center': true,
          'font-pewter': true,
          [font('hnl', 5)]: true,
          'flex-end': true,
        })}
        v={{
          size: 'm',
          properties: ['padding-top', 'padding-bottom'],
          overrides: { small: 5, medium: 5, large: 1 },
        }}
      >
        {showPortal && <div id="sort-select-portal"></div>}
        <PaginatorWrapper hideMobilePagination={hideMobilePagination}>
          {prevLink && prev && (
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <Control
                link={prevLink}
                clickHandler={event => {
                  onPageChange(event, prev);
                }}
                colorScheme="light"
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
                colorScheme="light"
                icon="arrow"
                text={`Next (page ${next})`}
              />
            </Space>
          )}
        </PaginatorWrapper>
      </Space>
    </Fragment>
  );
};
export default Paginator;
