import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { LinkProps } from '../../../model/link-props';
import { classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import Pagination from '../Pagination/Pagination';
import Sort from '@weco/common/views/components/Sort/Sort';
import { pluralize } from '@weco/common/utils/grammar';
import { Query } from '@weco/common/model/search';

type PageChangeFunction = (event: Event, page: number) => Promise<void>;

type Props = {
  totalResults: number;
  totalPages: number;
  currentPage: number;
  link: LinkProps;
  onPageChange: PageChangeFunction;
  query?: Query;
  hasSort?: boolean;
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

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

// TODO rename since we added Sort here?
const Paginator: FunctionComponent<Props> = ({
  totalResults,
  totalPages,
  currentPage,
  link,
  onPageChange,
  query,
  hasSort,
  hideMobilePagination,
  hideMobileTotalResults,
  isLoading,
}: Props) => {
  return (
    <>
      <Space
        h={{ size: 'm', properties: ['margin-right'] }}
        className={`flex flex--v-center ${font('intb', 3)}`}
      >
        <TotalResultsWrapper
          hideMobileTotalResults={hideMobileTotalResults}
          role="status"
        >
          {pluralize(totalResults, 'result')}
          {query?.query && ` for “${query.query}”`}
        </TotalResultsWrapper>
      </Space>

      <SortPaginationWrapper>
        {hasSort && (
          <Sort
            formId="worksSearchForm"
            options={[
              { value: '', text: 'Relevance' },
              { value: 'production.dates.asc', text: 'Oldest to newest' },
              { value: 'production.dates.desc', text: 'Newest to oldest' },
            ]}
            jsLessOptions={{
              sort: [
                { value: '', text: 'Relevance' },
                { value: 'production.dates', text: 'Production dates' },
              ],
              sortOrder: [
                { value: 'asc', text: 'Ascending' },
                { value: 'desc', text: 'Descending' },
              ],
            }}
            defaultValues={{
              sort: query?.sort,
              sortOrder: query?.sortOrder,
            }}
          />
        )}

        <Pagination
          paginatedResults={{
            currentPage,
            totalPages,
          }}
          paginationRoot={link}
          hideMobilePagination={hideMobilePagination}
          disabled={isLoading}
          onPageChange={onPageChange}
        />
      </SortPaginationWrapper>
    </>
  );
};
export default Paginator;
