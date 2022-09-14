import { Fragment, FunctionComponent } from 'react';
import { LinkProps } from '../../../model/link-props';
import { classNames, font } from '../../../utils/classnames';
import Control from '../Buttons/Control/Control';
import Space from '../styled/Space';
import Rotator from '../styled/Rotator';
import styled from 'styled-components';
import { arrow } from '@weco/common/icons';

type PageChangeFunction = (event: Event, page: number) => Promise<void>;

type Props = {
  query?: string;
  showPortal?: boolean;
  currentPage: number;
  pageSize: number;
  totalResults: number;
  link: LinkProps;
  onPageChange: PageChangeFunction;
  hideMobilePagination?: boolean;
  hideMobileTotalResults?: boolean;
  isLoading?: boolean;
};

type PaginatorWrapperProps = {
  hideMobilePagination: boolean | undefined;
};
const PaginatorWrapper = styled.div.attrs<PaginatorWrapperProps>(props => ({
  className: classNames({
    'is-hidden-s': Boolean(props.hideMobilePagination),
    flex: true,
    'flex--v-center': true,
  }),
}))<PaginatorWrapperProps>``;

type TotalResultsWrapperProps = {
  hideMobileTotalResults: boolean | undefined;
};
const TotalResultsWrapper = styled.div.attrs<TotalResultsWrapperProps>(
  props => ({
    className: classNames({
      'is-hidden-s': Boolean(props.hideMobileTotalResults),
    }),
  })
)<TotalResultsWrapperProps>``;

const Paginator: FunctionComponent<Props> = ({
  query,
  showPortal,
  currentPage,
  pageSize,
  totalResults,
  link,
  onPageChange,
  hideMobilePagination,
  hideMobileTotalResults,
  isLoading,
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
            ...link?.as?.query,
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
            ...link?.as?.query,
            page: next,
          },
        },
      }
    : null;

  return (
    <Fragment>
      <Space
        h={{ size: 'm', properties: ['margin-right'] }}
        className={`flex flex--v-center ${font('intb', 3)}`}
      >
        <TotalResultsWrapper
          hideMobileTotalResults={hideMobileTotalResults}
          role="status"
        >
          {totalResults} {totalResults !== 1 ? 'results' : 'result'}
          {query && ` for “${query}”`}
        </TotalResultsWrapper>
      </Space>
      <Space
        className={
          'pagination float-r flex-inline flex--v-center flex-end' +
          ' ' +
          font('intr', 5)
        }
        v={{
          size: 'm',
          properties: ['padding-top', 'padding-bottom'],
          overrides: { small: 5, medium: 5, large: 1 },
        }}
      >
        {showPortal && <div id="sort-select-portal"></div>}
        <PaginatorWrapper
          hideMobilePagination={hideMobilePagination}
          aria-label="Pagination navigation"
          role="navigation"
        >
          {prevLink && prev && (
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <Rotator rotate={180}>
                <Control
                  link={prevLink}
                  clickHandler={event => {
                    onPageChange(event, prev);
                  }}
                  colorScheme="light"
                  icon={arrow}
                  text={`Previous (page ${prev})`}
                  disabled={isLoading}
                />
              </Rotator>
            </Space>
          )}
          <span className="font-pewter">
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
                icon={arrow}
                text={`Next (page ${next})`}
                disabled={isLoading}
              />
            </Space>
          )}
        </PaginatorWrapper>
      </Space>
    </Fragment>
  );
};
export default Paginator;
