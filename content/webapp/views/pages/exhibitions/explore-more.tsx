import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';
import styled from 'styled-components';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { typography } from '@weco/common/utils/classnames';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
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
import RelatedWorksCard from '@weco/content/views/components/RelatedWorksCard';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import { ListItem } from '@weco/content/views/components/ScrollContainer/ScrollContainer.styles';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import WorkCard from '@weco/content/views/components/WorkCards/WorkCards.Card';

const BeigeSection = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

export type WorkGroup = {
  heading: string;
  description: string;
  works: WorkBasic[];
};

export type Props = {
  exhibition: Exhibition;
  page: Page;
  jsonLd: JsonLdObj;
  workGroups: WorkGroup[];
  exhibitionWorks: WorkBasic[];
};

const ExploreMorePage: NextPage<Props> = ({
  exhibition,
  page,
  jsonLd,
  workGroups,
  exhibitionWorks,
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
        breadcrumbs={getBreadcrumbItems('whats-on', [
          { url: '/exhibitions', text: 'Exhibitions' },
          { url: linkResolver(exhibition), text: exhibition.title },
          {
            url: `/exhibitions/${exhibition.uid}/explore-more`,
            text: page.title,
            isHidden: true,
          },
        ])}
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
          <Space $v={{ size: 'md', properties: ['margin-top'] }}>
            <Space as="p" $v={{ size: 'lg', properties: ['margin-bottom'] }}>
              Explore a selection of related works from our collection,
              exploring HIV, activism and intimacy.
            </Space>
          </Space>
        </ContaineredLayout>
        {workGroups.map(group =>
          group.works.length > 0 ? (
            <div key={group.heading}>
              <ScrollContainer
                hasWorkCards={true}
                CopyContent={
                  <>
                    <h3
                      className={typography('heading', 'lg', 'strong', 'brand')}
                    >
                      {group.heading}
                    </h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: group.description }}
                    ></div>
                  </>
                }
                gridSizes={gridSize12()}
                useShim={true}
              >
                {group.works.map(work => (
                  <ListItem key={work.id} $usesShim>
                    <WorkCard item={work} />
                  </ListItem>
                ))}
              </ScrollContainer>
            </div>
          ) : null
        )}
      </SpacingSection>
      {exhibitionWorks.length > 0 && (
        <BeigeSection>
          <ContaineredLayout gridSizes={gridSize12()}>
            <SectionHeader title="Works in this exhibition" />
          </ContaineredLayout>
          <Space $v={{ size: 'md', properties: ['margin-top'] }}>
            <ScrollContainer
              gridSizes={gridSize12()}
              useShim={true}
              CopyContent={
                <p>Find the items on display in our online catalogue.</p>
              }
            >
              {exhibitionWorks.map(work => (
                <ListItem key={work.id} $usesShim>
                  <RelatedWorksCard variant="default" work={work} />
                </ListItem>
              ))}
            </ScrollContainer>
          </Space>
        </BeigeSection>
      )}
    </PageLayout>
  );
};
export default ExploreMorePage;
