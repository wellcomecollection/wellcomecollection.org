import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';
import styled from 'styled-components';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { ImageType } from '@weco/common/model/image';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import SearchForm from '@weco/common/views/components/SearchForm';
import Space from '@weco/common/views/components/styled/Space';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
import { themeValues } from '@weco/common/views/themes/config';
import { useCollectionStats } from '@weco/content/hooks/useCollectionStats';
import type { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { MultiContent } from '@weco/content/types/multi-content';
import CardGrid from '@weco/content/views/components/CardGrid';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import BrowseByThemes from '@weco/content/views/pages/collections/collections.BrowseByThemes';
import NewOnline from '@weco/content/views/pages/collections/collections.NewOnline';
import WorkTypesList from '@weco/content/views/pages/collections/collections.WorkTypesList';
import { themeBlockCategories } from '@weco/content/views/pages/collections/themeBlockCategories';

const MainBackground = styled.div<{ $isDefaultVariant: boolean }>`
  position: relative;
  overflow: hidden;

  /* split background: top half the chosen colour, bottom half transparent */
  background: ${props =>
    `linear-gradient(to bottom, ${props.theme.color(
      props.$isDefaultVariant ? 'accent.lightBlue' : 'accent.lightPurple'
    )} 65%, transparent 65%)`};
`;

const MaterialsSection = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const DecorativeEdgeContainer = styled(Space).attrs({
  $v: { size: 'xl', properties: ['margin-top'] },
})`
  margin-left: -${themeValues.containerPadding.small}px;

  ${themeValues.media('medium')(`
    margin-left: -${themeValues.containerPadding.medium}px;
  `)}

  ${themeValues.media('large')(`
    margin-left: -${themeValues.containerPadding.large}px;
  `)}
`;

export type Props = {
  pageMeta: {
    id: string;
    image?: ImageType;
    description?: string;
  };
  title: string;
  introText: prismic.RichTextField;
  insideOurCollectionsCards: MultiContent[];
  featuredConcepts: Concept[];
  fullWidthBanners?: prismic.Slice<'fullWidthBanner'>[];
};

const CollectionsLandingPage: NextPage<Props> = ({
  pageMeta,
  title,
  introText,
  insideOurCollectionsCards,
  featuredConcepts,
  fullWidthBanners,
}) => {
  const { data: collectionStats } = useCollectionStats();

  return (
    <PageLayout
      title="Collections"
      description={pageMeta.description || pageDescriptions.collections}
      url={{ pathname: '/collections' }}
      jsonLd={[]}
      openGraphType="website"
      siteSection="collections"
      image={pageMeta.image}
      apiToolbarLinks={[createPrismicLink(pageMeta.id)]}
      isNoIndex // TODO remove when this becomes the page
      hideNewsletterPromo
    >
      <PageHeader variant="landing" title={title} introText={introText} />

      <ContaineredLayout gridSizes={gridSize12()}>
        <DecorativeEdgeContainer>
          <DecorativeEdge variant="w" shape="edge-1" color="accent.lightBlue" />
        </DecorativeEdgeContainer>
      </ContaineredLayout>

      <div style={{ backgroundColor: themeValues.color('accent.lightBlue') }}>
        <ContaineredLayout gridSizes={gridSize10(false)}>
          <Space
            $v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
          >
            <SearchForm
              searchCategory="works"
              location="page"
              isNew
              hasAvailableOnlineOnly
            />
          </Space>
        </ContaineredLayout>
      </div>

      <MainBackground
        data-component="full-width-banner"
        $isDefaultVariant={true}
      >
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <SectionHeader title="Browse by theme" gridSize={gridSize12()} />
          <BrowseByThemes
            themeConfig={themeBlockCategories}
            initialConcepts={featuredConcepts}
            gridSizes={gridSize12()}
          />
        </Space>
      </MainBackground>

      <Space $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}>
        <SectionHeader title="New online" gridSize={gridSize12()} />
        <ContaineredLayout gridSizes={gridSize12()}>
          <NewOnline />
        </ContaineredLayout>
      </Space>

      {fullWidthBanners?.[0] && (
        <Space $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}>
          <SliceZone slices={[fullWidthBanners[0]]} components={components} />
        </Space>
      )}

      <Space $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}>
        <SectionHeader title="Inside our collections" gridSize={gridSize12()} />
        <ContaineredLayout gridSizes={gridSize12()}>
          <p>
            Explore stories inspired by the objects, manuscripts and archives in
            our collection.
          </p>
        </ContaineredLayout>

        <CardGrid
          items={insideOurCollectionsCards}
          itemsPerRow={3}
          itemsHaveTransparentBackground
          links={[
            {
              text: 'Read all stories',
              url: '/series/inside-our-collections',
            },
          ]}
        />
      </Space>

      <MaterialsSection>
        <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
          <SectionHeader
            title="Types of materials in the collections"
            gridSize={gridSize12()}
          />
        </Space>

        <ContaineredLayout gridSizes={gridSize12()}>
          <WorkTypesList collectionStats={collectionStats} />
        </ContaineredLayout>
      </MaterialsSection>

      {fullWidthBanners?.[1] && (
        <SliceZone slices={[fullWidthBanners[1]]} components={components} />
      )}
    </PageLayout>
  );
};

export default CollectionsLandingPage;
