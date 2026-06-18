import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';

import { font } from '@weco/common/utils/classnames';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
import { Exhibition } from '@weco/content/types/exhibitions';
import { Page } from '@weco/content/types/pages';

export type Props = {
  exhibition: Exhibition;
  page: Page;
  jsonLd: JsonLdObj;
};

const ExploreMorePage: NextPage<Props> = ({ exhibition, page, jsonLd }) => {
  return (
    <PageLayout
      title={page.title}
      isNoIndex={true}
      description={
        page.metadataDescription ||
        exhibition.metadataDescription ||
        exhibition.promo?.caption ||
        ''
      }
      url={{ pathname: `/exhibitions/${exhibition.uid}/explore-more` }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection="whats-on"
      image={exhibition.image}
    >
      <PageHeader
        variant="basic"
        breadcrumbs={{ items: [] }}
        title={page.title}
        isContentTypeInfoBeforeMedia={true}
        ContentTypeInfo={
          page.introText && page.introText.length > 0 ? (
            <PageHeaderStandfirst html={page.introText} />
          ) : undefined
        }
      />
      <SpacingSection>
        <SliceZone
          slices={page.untransformedBody}
          components={components}
          context={{
            itemsHaveTransparentBackground: false,
            cardSizeMap: { s: [12], m: [6], l: [6], xl: [6] },
            isFirstCardFeatured: true,
          }}
        />
      </SpacingSection>
      <SpacingSection>
        <ContaineredLayout gridSizes={gridSize12()}>
          <h2 className={font('brand-bold', 2)}>
            Explore related items from our collections
          </h2>
        </ContaineredLayout>
      </SpacingSection>
      <SpacingSection>
        <ContaineredLayout gridSizes={gridSize12()}>
          <h2 className={font('brand-bold', 2)}>
            Browse our collections by theme
          </h2>
        </ContaineredLayout>
      </SpacingSection>
      <SpacingSection>
        <ContaineredLayout gridSizes={gridSize12()}>
          <h2 className={font('brand-bold', 2)}>
            On display in the exhibition
          </h2>
        </ContaineredLayout>
      </SpacingSection>
    </PageLayout>
  );
};

export default ExploreMorePage;
