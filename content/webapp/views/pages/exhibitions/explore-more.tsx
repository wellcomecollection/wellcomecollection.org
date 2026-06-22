import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import { font } from '@weco/common/utils/classnames';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { Exhibition } from '@weco/content/types/exhibitions';
import { Page } from '@weco/content/types/pages';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import { ListItem } from '@weco/content/views/components/ScrollContainer/ScrollContainer.styles';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import WorkCard from '@weco/content/views/components/WorkCards/WorkCards.Card';

export type Props = {
  exhibition: Exhibition;
  page: Page;
  jsonLd: JsonLdObj;
  works: WorkBasic[];
};

const ExploreMorePage: NextPage<Props> = ({
  exhibition,
  page,
  jsonLd,
  works,
}) => {
  const { isKiosk } = useKiosk();

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
            ...(isKiosk && {
              cardSizeMap: { s: [12], m: [6], l: [6], xl: [6] },
            }),
            isFirstCardFeatured: true,
          }}
        />
      </SpacingSection>
      <SpacingSection>
        <ContaineredLayout gridSizes={gridSize12()}>
          <SectionHeader title="Related works from the collection" />
          <Space $v={{ size: 'lg', properties: ['margin-top'] }}>
            <p>
              Explore a selection of related works from our collection,
              exploring HIV, activism and intimacy.
            </p>
          </Space>
        </ContaineredLayout>
        {works.length > 0 && (
          <ScrollContainer
            useAlignBaseline={true}
            CopyContent={
              <>
                <h3 className={font('brand', 1)}>ACT UP</h3>
                <p>
                  ACT UP (AIDS Coalition to Unleash Power) is an activist group
                  focused on direct action against the AIDS epidemic. Founded in
                  New York in 1987, it expanded into a global network of
                  independent chapters campaigning around HIV.
                </p>
                <p>
                  This selection features material from chapters in New York,
                  London, Manchester and Paris.
                </p>
              </>
            }
            gridSizes={gridSize12()}
            useShim={true}
          >
            {works.map(work => (
              <ListItem key={work.id} $usesShim>
                <WorkCard item={work} />
              </ListItem>
            ))}
          </ScrollContainer>
        )}
      </SpacingSection>
    </PageLayout>
  );
};
export default ExploreMorePage;
