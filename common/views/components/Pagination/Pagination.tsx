import { FunctionComponent } from 'react';
import { classNames, font } from '../../../utils/classnames';
import Control from '../Buttons/Control/Control';
import Space from '../styled/Space';
import Rotator from '../styled/Rotator';
import { arrow } from '@weco/common/icons';
import styled from 'styled-components';
import { LinkProps } from '../../../model/link-props';

type PageChangeFunction = (event: Event, page: number) => Promise<void>;

export type PaginatedResultsProps = {
  currentPage: number;
  totalPages: number;
};

export type Props = {
  paginatedResults: PaginatedResultsProps;
  paginationRoot: LinkProps;
  hideMobilePagination?: boolean;
  disabled?: boolean;
  onPageChange?: PageChangeFunction;
  showPortal?: boolean;
};

const PaginatorContainer = styled(Space).attrs({
  className: font('intr', 5),
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 5, medium: 5, large: 1 },
  },
})`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

type PaginatorWrapperProps = {
  hideMobilePagination?: boolean;
};
const PaginatorWrapper = styled.nav.attrs<PaginatorWrapperProps>(props => ({
  className: classNames({
    'is-hidden-s': Boolean(props.hideMobilePagination),
  }),
}))<PaginatorWrapperProps>`
  display: flex;
  align-items: center;
`;

const Pagination: FunctionComponent<Props> = ({
  paginatedResults,
  paginationRoot,
  hideMobilePagination,
  disabled,
  onPageChange,
  showPortal,
}: Props) => {
  const { currentPage, totalPages } = paginatedResults;

  const prevPage = currentPage > 1 ? currentPage - 1 : undefined;
  const nextPage = currentPage < totalPages ? currentPage + 1 : undefined;

  const prevQueryString = prevPage
    ? {
        href: {
          ...paginationRoot.href,
          query: {
            ...paginationRoot.href.query,
            page: prevPage,
          },
        },
        as: {
          ...paginationRoot.as,
          query: {
            ...paginationRoot?.as?.query,
            page: prevPage,
          },
        },
      }
    : null;

  const nextQueryString = nextPage
    ? {
        href: {
          ...paginationRoot.href,
          query: {
            ...paginationRoot.href.query,
            page: nextPage,
          },
        },
        as: {
          ...paginationRoot.as,
          query: {
            ...paginationRoot?.as?.query,
            page: nextPage,
          },
        },
      }
    : null;

  return (
    <PaginatorContainer>
      {showPortal && <div id="sort-select-portal"></div>}
      <PaginatorWrapper
        aria-label="pagination"
        hideMobilePagination={hideMobilePagination}
      >
        {prevPage && prevQueryString && (
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <Rotator rotate={180}>
              <Control
                link={prevQueryString}
                colorScheme="light"
                icon={arrow}
                text={`Previous (page ${prevPage})`}
                disabled={disabled}
                clickHandler={
                  onPageChange
                    ? event => {
                        onPageChange(event, prevPage);
                      }
                    : undefined
                }
              />
            </Rotator>
          </Space>
        )}

        <span className="font-neutral-600">
          Page {currentPage} of {totalPages}
        </span>

        {nextPage && nextQueryString && (
          <Space as="span" h={{ size: 'm', properties: ['margin-left'] }}>
            <Control
              link={nextQueryString}
              colorScheme="light"
              icon={arrow}
              text={`Next (page ${nextPage})`}
              disabled={disabled}
              clickHandler={
                onPageChange
                  ? event => {
                      onPageChange(event, nextPage);
                    }
                  : undefined
              }
            />
          </Space>
        )}
      </PaginatorWrapper>
    </PaginatorContainer>
  );
};

export default Pagination;
