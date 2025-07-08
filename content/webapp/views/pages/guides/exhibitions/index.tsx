import { NextPage } from 'next';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { pluralize } from '@weco/common/utils/grammar';
import Divider from '@weco/common/views/components/Divider';
import { exhibitionGuidesLinks } from '@weco/common/views/components/Header';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { ExhibitionGuideBasic } from '@weco/content/types/exhibition-guides';
import CardGrid from '@weco/content/views/components/CardGrid';
import Pagination from '@weco/content/views/components/Pagination';

export type Props = {
  exhibitionGuides: PaginatedResults<ExhibitionGuideBasic>;
  jsonLd: JsonLdObj[];
};

const ExhibitionGuidesPage: NextPage<Props> = props => {
  const { exhibitionGuides } = props;

  const image = exhibitionGuides.results[0]?.image;

  return (
    <PageLayout
      title="Digital Guides"
      description={pageDescriptions.exhibitionGuides}
      url={{ pathname: '/guides/exhibitions' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="exhibition-guides"
      image={image}
      headerProps={{
        customNavLinks: exhibitionGuidesLinks,
        isMinimalHeader: true,
      }}
      hideNewsletterPromo={true}
    >
      <SpacingSection>
        <PageHeader
          breadcrumbs={{ items: [], noHomeLink: true }}
          title="Digital Guides"
          backgroundTexture={headerBackgroundLs}
          highlightHeading={true}
        />

        {exhibitionGuides.totalPages > 1 && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="l">
              <span>{pluralize(exhibitionGuides.totalResults, 'result')}</span>

              <Pagination
                totalPages={exhibitionGuides.totalPages}
                ariaLabel="Results pagination"
                isHiddenMobile
              />
            </PaginationWrapper>

            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              <Divider />
            </Space>
          </ContaineredLayout>
        )}

        <Space $v={{ size: 'l', properties: ['margin-top'] }}>
          {exhibitionGuides.results.length > 0 ? (
            <CardGrid items={exhibitionGuides.results} itemsPerRow={3} />
          ) : (
            <ContaineredLayout gridSizes={gridSize12()}>
              <p>There are no results.</p>
            </ContaineredLayout>
          )}
        </Space>

        {exhibitionGuides.totalPages > 1 && (
          <ContaineredLayout gridSizes={gridSize12()}>
            <PaginationWrapper $verticalSpacing="l" $alignRight>
              <Pagination
                totalPages={exhibitionGuides.totalPages}
                ariaLabel="Results pagination"
              />
            </PaginationWrapper>
          </ContaineredLayout>
        )}
      </SpacingSection>
    </PageLayout>
  );
};

export default ExhibitionGuidesPage;
