import styled from 'styled-components';

import { pluralize } from '@weco/common/utils/grammar';
import Layout, { gridSize12 } from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import {
  Grid,
  GridCell,
  StartSpan,
} from '@weco/common/views/components/styled/Grid';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import type { ArchiveTypeWorksResult } from '@weco/content/services/wellcome/catalogue/works';
import ArchiveCard from '@weco/content/views/components/ArchiveCard';
import Pagination from '@weco/content/views/components/Pagination';
import Sort from '@weco/content/views/components/Sort';

const ARCHIVE_TYPE_SORT_FORM_ID = 'archive-type-sort-form';

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const ArchiveTypeWorksList = ({
  works,
  archiveTypeLabel,
  sort,
  sortOrder,
}: {
  works: ArchiveTypeWorksResult;
  archiveTypeLabel: string;
  sort?: string;
  sortOrder?: string;
}) => {
  const colsToSpan: StartSpan = works.works.length >= 4 ? [3] : [4];

  return (
    <Container>
      <form id={ARCHIVE_TYPE_SORT_FORM_ID} role="search" />

      {works.works.length > 0 && (
        <Layout gridSizes={gridSize12()}>
          <PaginationWrapper $verticalSpacing="md">
            <span role="status">{pluralize(works.totalResults, 'result')}</span>

            <SortPaginationWrapper>
              <Sort
                formId={ARCHIVE_TYPE_SORT_FORM_ID}
                options={[
                  // Default value left empty so it's not added to the URL query
                  { value: '', text: 'Alphabetical A-Z' },
                  {
                    value: 'production.dates.asc',
                    text: 'Oldest to newest',
                  },
                  {
                    value: 'production.dates.desc',
                    text: 'Newest to oldest',
                  },
                ]}
                jsLessOptions={{
                  sort: [
                    { value: '', text: 'Alphabetical' },
                    {
                      value: 'production.dates',
                      text: 'Production dates',
                    },
                  ],
                  sortOrder: [
                    { value: 'asc', text: 'Ascending' },
                    { value: 'desc', text: 'Descending' },
                  ],
                }}
                defaultValues={{ sort, sortOrder }}
              />

              {works.totalPages > 1 && (
                <Pagination
                  totalPages={works.totalPages}
                  ariaLabel="Results pagination"
                  isHiddenMobile
                />
              )}
            </SortPaginationWrapper>
          </PaginationWrapper>
        </Layout>
      )}

      {works.works.length > 0 ? (
        <Space $v={{ size: 'xl', properties: ['padding-bottom'] }}>
          <Grid>
            {works.works.map((work, index) => (
              <GridCell
                key={work.id}
                $sizeMap={{ s: [12], m: [6], l: colsToSpan, xl: colsToSpan }}
              >
                <ArchiveCard
                  {...work}
                  dataGtmProps={{
                    trigger: 'archive_card',
                    'category-label': archiveTypeLabel,
                    id: work.id,
                    'position-in-list': `${index + 1}`,
                  }}
                />
              </GridCell>
            ))}
          </Grid>
        </Space>
      ) : (
        <Space
          $v={{
            size: 'md',
            properties: ['padding-top', 'padding-bottom'],
          }}
        >
          <Layout gridSizes={gridSize12()}>
            <p>There are no results.</p>
          </Layout>
        </Space>
      )}

      {works.totalPages > 1 && (
        <Layout gridSizes={gridSize12()}>
          <PaginationWrapper $verticalSpacing="md" $alignRight>
            <Pagination
              totalPages={works.totalPages}
              ariaLabel="Results pagination"
            />
          </PaginationWrapper>
        </Layout>
      )}
    </Container>
  );
};

export default ArchiveTypeWorksList;
