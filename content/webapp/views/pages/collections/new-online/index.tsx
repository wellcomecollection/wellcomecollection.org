import { NextPage } from 'next';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { pluralize } from '@weco/common/utils/grammar';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import Divider from '@weco/common/views/components/Divider';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { WellcomeResultList } from '@weco/content/services/wellcome';
import {
  WorkAggregations,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import Pagination from '@weco/content/views/components/Pagination';
import WorkCardAPI from '@weco/content/views/components/WorkCard/WorkCard.API';

export type Props = {
  works: WellcomeResultList<WorkBasic, WorkAggregations>;
  apiToolbarLinks: ApiToolbarLink[];
};

const NewOnlinePage: NextPage<Props> = ({ works }) => {
  const TOTAL_PAGES = 4;
  const TOTAL_RESULTS = TOTAL_PAGES * works.pageSize;

  return (
    <PageLayout
      title="New online"
      description={pageDescriptions.collections.newOnline}
      url={{ pathname: '/collections/new-online' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="collections"
      // TODO image ?
    >
      <SpacingSection>
        <PageHeader
          variant="basic"
          breadcrumbs={getBreadcrumbItems('collections')}
          title="New online"
          ContentTypeInfo={
            pageDescriptions.collections.newOnline && (
              <PrismicHtmlBlock
                html={[
                  {
                    type: 'paragraph',
                    text: pageDescriptions.collections.newOnline,
                    spans: [],
                  },
                ]}
              />
            )
          }
          backgroundTexture={headerBackgroundLs}
          highlightHeading={true}
        />

        {works.totalPages > 1 && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="l">
              <span>{pluralize(TOTAL_RESULTS, 'result')}</span>

              <Pagination
                totalPages={TOTAL_PAGES}
                ariaLabel="Results pagination"
                isHiddenMobile
              />
            </PaginationWrapper>

            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              <Divider />
            </Space>
          </ContaineredLayout>
        )}

        <ContaineredLayout gridSizes={gridSize12()}>
          <Space $v={{ size: 'l', properties: ['margin-top'] }}>
            {works.results.length > 0 ? (
              <Grid>
                {works.results.map(item => {
                  return (
                    <GridCell
                      key={item.id}
                      $sizeMap={{ s: [12], m: [6], l: [3], xl: [3] }}
                    >
                      <Space $v={{ size: 'l', properties: ['margin-top'] }}>
                        <WorkCardAPI item={item} />
                      </Space>
                    </GridCell>
                  );
                })}
              </Grid>
            ) : (
              <ContaineredLayout gridSizes={gridSize12()}>
                <p>There are no results.</p>
              </ContaineredLayout>
            )}
          </Space>
        </ContaineredLayout>

        {works.totalPages > 1 && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="l" $alignRight>
              <Pagination
                totalPages={TOTAL_PAGES}
                ariaLabel="Results pagination"
              />
            </PaginationWrapper>
          </ContaineredLayout>
        )}
      </SpacingSection>
    </PageLayout>
  );
};

export default NewOnlinePage;
