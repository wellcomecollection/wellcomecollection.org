import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import ThemePromo from '@weco/common/views/components/ThemePromo';
import { themeValues } from '@weco/common/views/themes/config';
import { useConceptImageUrls } from '@weco/content/hooks/useConceptImageUrls';
import { useThemeConcepts } from '@weco/content/hooks/useThemeConcepts';
import { getConceptsByIds } from '@weco/content/pages/collections';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { toConceptLink } from '@weco/content/views/components/ConceptLink';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import SelectableTags from '@weco/content/views/components/SelectableTags';

import type { ThemeConfig } from './themeBlockCategories';

type BrowseByThemeProps = {
  themeConfig: ThemeConfig;
  initialConcepts: Concept[];
  gridSizes: SizeMap;
};

const ListItem = styled.li`
  --gap: ${themeValues.gutter.medium}px;
  flex: 0 0 auto;
  width: 400px;
  max-width: 90vw;
  margin-right: var(--gap);
`;

const Theme: FunctionComponent<{ concept: Concept }> = ({ concept }) => {
  const images = useConceptImageUrls(concept);
  const linkProps = toConceptLink({ conceptId: concept.id });
  const title = concept.displayLabel || concept.label;
  return linkProps && title ? (
    <ThemePromo
      images={images}
      title={title}
      description={concept.description?.text}
      linkProps={linkProps}
    />
  ) : null;
};

const BrowseByThemes: FunctionComponent<BrowseByThemeProps> = ({
  themeConfig,
  initialConcepts,
  gridSizes,
}) => {
  const { fetchConcepts, setCache } = useThemeConcepts(
    initialConcepts,
    getConceptsByIds
  );

  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [displayedConcepts, setDisplayedConcepts] =
    useState<Concept[]>(initialConcepts);

  // Set the cache with the first category and display it
  useEffect(() => {
    const firstLabel = themeConfig.categories[0]?.label;
    if (firstLabel) setCache(firstLabel, initialConcepts);
    setDisplayedConcepts(initialConcepts);
  }, [initialConcepts, themeConfig.categories, setCache]);

  const handleCategoryChange = async (selectedIds: string[]) => {
    const selectedCategoryId = selectedIds[0];
    const category = themeConfig.categories.find(
      cat => cat.label === selectedCategoryId
    );
    if (category) {
      const result = await fetchConcepts(category);
      setDisplayedConcepts(result);
    }
  };

  // Reset scroll position when a new theme category is selected
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [displayedConcepts]);

  const tagData = themeConfig.categories.map(category => ({
    id: category.label,
    label: category.label,
  }));

  return (
    <Space
      $v={{ size: 'm', properties: ['margin-top'] }}
      data-component="BrowseByThemes"
    >
      <ContaineredLayout gridSizes={gridSize12()}>
        <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
          <SelectableTags
            tags={tagData}
            isMultiSelect={false}
            onChange={handleCategoryChange}
          />
        </Space>
      </ContaineredLayout>
      <ScrollContainer
        scrollButtonsAfter={true}
        gridSizes={gridSizes}
        customScrollDistance={424} // 400px card width + 24px gap
        containerRef={scrollContainerRef}
        useShim={true}
      >
        {displayedConcepts.map(concept => (
          <ListItem key={concept.id}>
            <Theme concept={concept} />
          </ListItem>
        ))}
      </ScrollContainer>
    </Space>
  );
};

export default BrowseByThemes;
