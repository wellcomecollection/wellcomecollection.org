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
import BrowseByThemesData from '@weco/content/views/pages/collections/collections.BrowseByThemesData';
import WorkTypesList from '@weco/content/views/pages/collections/collections.WorkTypesList';
import { themeBlockCategories } from '@weco/content/views/pages/collections/themeBlockCategories';

import BrowseByTheme from './collections.BrowseByTheme';

const MaterialsSection = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const WShapeContainer = styled(Space).attrs({
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
  // jsonLd: JsonLdObj[]; ??
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
      jsonLd={[]} // TODO?
      openGraphType="website"
      siteSection="collections"
      image={pageMeta.image}
      apiToolbarLinks={[createPrismicLink(pageMeta.id)]}
      isNoIndex // TODO remove when this becomes the page
      hideNewsletterPromo
    >
      <PageHeader variant="simpleLanding" title={title} introText={introText} />

      <ContaineredLayout gridSizes={gridSize12()}>
        <WShapeContainer>
          <DecorativeEdge variant="w" color="accent.lightBlue" />
        </WShapeContainer>
      </ContaineredLayout>

      <div style={{ backgroundColor: themeValues.color('accent.lightBlue') }}>
        <ContaineredLayout gridSizes={gridSize10(false)}>
          <Space
            $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
          >
            <SearchForm searchCategory="works" location="page" isNew={true} />
          </Space>
        </ContaineredLayout>

        <Space
          $v={{ size: 'xl', properties: ['padding-top', 'margin-bottom'] }}
        >
          <ContaineredLayout gridSizes={gridSize12()}>
            <BrowseByTheme />
          </ContaineredLayout>
        </Space>
      </div>

      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <SectionHeader title="Browse by theme" gridSize={gridSize12()} />
        <ContaineredLayout gridSizes={gridSize12()}>
          <BrowseByThemesData
            themeConfig={themeBlockCategories}
            initialConcepts={featuredConcepts}
          />
        </ContaineredLayout>
      </Space>

      {fullWidthBanners?.[0] && (
        <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
          <SliceZone slices={[fullWidthBanners[0]]} components={components} />
        </Space>
      )}

      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <SectionHeader title="Inside our collections" gridSize={gridSize12()} />
        <ContaineredLayout gridSizes={gridSize12()}>
          <p>
            Explore stories inspired by the objects, manuscripts and archives in
            our collection
          </p>
        </ContaineredLayout>

        <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
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
