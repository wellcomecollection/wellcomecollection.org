import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { pluralize } from '@weco/common/utils/grammar';
import { SEARCH_PAGES_FORM_ID } from '@weco/common/utils/search';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Pagination from '@weco/content/views/components/Pagination';
import Sort from '@weco/content/views/components/Sort';

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const sortOptions = [
  { value: '', text: 'Relevance' },
  { value: 'source.production.dates.asc', text: 'Oldest to newest' },
  { value: 'source.production.dates.desc', text: 'Newest to oldest' },
];

const jsLessSortOptions = {
  sort: [
    { value: '', text: 'Relevance' },
    { value: 'source.production.dates', text: 'Production dates' },
  ],
  sortOrder: [
    { value: 'asc', text: 'Ascending' },
    { value: 'desc', text: 'Descending' },
  ],
};

type Props = {
  totalResults: number;
  totalPages: number;
  activeFiltersLabels: string[];
  sort?: string;
  sortOrder?: string;
  isOnDark: boolean;
};

/**
 * The result count, sort and pagination above the image results. Sits in the
 * dark results area normally; in the light area above it when the image
 * sidebar is on.
 */
const ImagesResultsHeader: FunctionComponent<Props> = ({
  totalResults,
  totalPages,
  activeFiltersLabels,
  sort,
  sortOrder,
  isOnDark,
}) => (
  <PaginationWrapper $verticalSpacing="md">
    <span role="status">
      {pluralize(totalResults, 'result')}
      {activeFiltersLabels.length > 0 && (
        <span className="visually-hidden">
          {' '}
          filtered with: {activeFiltersLabels.join(', ')}
        </span>
      )}
    </span>

    <SortPaginationWrapper>
      <Sort
        formId={SEARCH_PAGES_FORM_ID}
        options={sortOptions}
        jsLessOptions={jsLessSortOptions}
        defaultValues={{ sort, sortOrder }}
        darkBg={isOnDark}
      />

      <Pagination
        totalPages={totalPages}
        ariaLabel="Image search pagination"
        isOnDark={isOnDark}
        isHiddenMobile
      />
    </SortPaginationWrapper>
  </PaginationWrapper>
);

export default ImagesResultsHeader;
