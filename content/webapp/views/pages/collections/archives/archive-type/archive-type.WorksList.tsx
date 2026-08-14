import { pluralize } from '@weco/common/utils/grammar';
import Divider from '@weco/common/views/components/Divider';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
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

const ArchiveTypeWorksList = ({
  works,
  archiveTypeLabel,
}: {
  works: ArchiveTypeWorksResult;
  archiveTypeLabel: string;
}) => {
  const colsToSpan: StartSpan = works.works.length >= 4 ? [3] : [4];

  return (
    <Container>
      {works.totalPages > 1 && (
        <ContaineredLayout gridSizes={gridSize12()}>
          <PaginationWrapper $verticalSpacing="md">
            <span>{pluralize(works.totalResults, 'result')}</span>

            <Pagination
              totalPages={works.totalPages}
              ariaLabel="Results pagination"
              isHiddenMobile
            />
          </PaginationWrapper>

          <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
            <Divider />
          </Space>
        </ContaineredLayout>
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
          <p>There are no results.</p>
        </Space>
      )}

      {works.totalPages > 1 && (
        <ContaineredLayout gridSizes={gridSize12()}>
          <PaginationWrapper $verticalSpacing="md" $alignRight>
            <Pagination
              totalPages={works.totalPages}
              ariaLabel="Results pagination"
            />
          </PaginationWrapper>
        </ContaineredLayout>
      )}
    </Container>
  );
};

export default ArchiveTypeWorksList;
