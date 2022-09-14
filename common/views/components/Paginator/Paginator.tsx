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

const PaginatorContainer = styled(Space).attrs({
  className: font('intr', 5),
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 5, medium: 5, large: 1 },
  },
})`
  float: right;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
`;

type PaginatorWrapperProps = {
  hideMobilePagination: boolean | undefined;
};
const PaginatorWrapper = styled.div.attrs<PaginatorWrapperProps>(props => ({
  className: classNames({
    'is-hidden-s': Boolean(props.hideMobilePagination),
    'font-pewter': true,
  }),
}))<PaginatorWrapperProps>`
  display: flex;
  align-items: center;
`;

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
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;

  const prevQueryString = prevPage
    ? {
        href: {
          ...link.href,
          query: {
            ...link.href.query,
            page: prevPage,
          },
        },
        as: {
          ...link.as,
          query: {
            ...link?.as?.query,
            page: prevPage,
          },
        },
      }
    : null;

  const nextQueryString = nextPage
    ? {
        href: {
          ...link.href,
          query: {
            ...link.href.query,
            page: nextPage,
          },
        },
        as: {
          ...link.as,
          query: {
            ...link?.as?.query,
            page: nextPage,
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
      <PaginatorContainer>
        {showPortal && <div id="sort-select-portal"></div>}
        <PaginatorWrapper
          hideMobilePagination={hideMobilePagination}
          aria-label="Pagination navigation"
          role="navigation"
        >
          {prevPage && prevQueryString && (
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <Rotator rotate={180}>
                <Control
                  link={prevQueryString}
                  colorScheme="light"
                  icon={arrow}
                  text={`Previous (page ${prevPage})`}
                  disabled={isLoading}
                  clickHandler={event => {
                    onPageChange(event, prevPage);
                  }}
                />
              </Rotator>
            </Space>
          )}

          <span>
            Page {currentPage} of {totalPages}
          </span>

          {nextPage && nextQueryString && (
            <Space as="span" h={{ size: 'm', properties: ['margin-left'] }}>
              <Control
                link={nextQueryString}
                colorScheme="light"
                icon={arrow}
                text={`Next (page ${nextPage})`}
                disabled={isLoading}
                clickHandler={event => {
                  onPageChange(event, nextPage);
                }}
              />
            </Space>
          )}
        </PaginatorWrapper>
      </PaginatorContainer>
    </Fragment>
  );
};
export default Paginator;
