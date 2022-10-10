import { Fragment, FunctionComponent } from 'react';
import { LinkProps } from '../../../model/link-props';
import { classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import Pagination from '../Pagination/Pagination';

type PageChangeFunction = (event: Event, page: number) => Promise<void>;

type Props = {
  totalResults: number;
  totalPages: number;
  currentPage: number;
  link: LinkProps;
  onPageChange: PageChangeFunction;
  query?: string;
  showPortal?: boolean;
  hideMobilePagination?: boolean;
  hideMobileTotalResults?: boolean;
  isLoading?: boolean;
};

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
  totalResults,
  totalPages,
  currentPage,
  link,
  onPageChange,
  query,
  showPortal,
  hideMobilePagination,
  hideMobileTotalResults,
  isLoading,
}: Props) => {
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
      <Pagination
        paginatedResults={{
          currentPage,
          totalPages,
        }}
        paginationRoot={link}
        hideMobilePagination={hideMobilePagination}
        disabled={isLoading}
        onPageChange={onPageChange}
        showPortal={showPortal}
      />
    </Fragment>
  );
};
export default Paginator;
