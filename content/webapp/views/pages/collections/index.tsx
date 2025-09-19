import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import { NextPage } from 'next';
import { useState } from 'react';
import styled from 'styled-components';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { ImageType } from '@weco/common/model/image';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import SearchBar from '@weco/common/views/components/SearchBar';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { components } from '@weco/common/views/slices';
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
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/search/works?query=${encodeURIComponent(searchValue.trim())}`;
    }
  };

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

      <SpacingSection>
        <ContaineredLayout gridSizes={gridSize10(false)}>
          <form id="collections-search" onSubmit={handleSearch}>
            <SearchBar
              variant="new"
              inputValue={searchValue}
              setInputValue={setSearchValue}
              placeholder="Search our collections"
              form="collections-search"
              location="page"
            />
          </form>
        </ContaineredLayout>
      </SpacingSection>

      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <ContaineredLayout gridSizes={gridSize12()}>
          <BrowseByTheme />
        </ContaineredLayout>
      </Space>

      {fullWidthBanners?.[0] && (
        <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
          <SliceZone slices={[fullWidthBanners[0]]} components={components} />
        </Space>
      )}

      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <SectionHeader title="Browse by theme" gridSize={gridSize12()} />
        <ContaineredLayout gridSizes={gridSize12()}>
          <BrowseByThemesData
            themeConfig={themeBlockCategories}
            initialConcepts={featuredConcepts}
          />
        </ContaineredLayout>
      </Space>

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
