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

function useResponsiveScrollDistance() {
  const [scrollDistance, setScrollDistance] = useState(400);

  useEffect(() => {
    const updateScrollDistance = () => {
      const width = window.innerWidth;

      if (width < 600) {
        // Small screens: use 90vw (max-width constraint)
        setScrollDistance(Math.min(400, window.innerWidth * 0.9));
      } else {
        // Medium screens and above: use full card width
        setScrollDistance(400);
      }
    };

    updateScrollDistance();
    window.addEventListener('resize', updateScrollDistance);
    return () => window.removeEventListener('resize', updateScrollDistance);
  }, []);

  return scrollDistance;
}

type BrowseByThemeProps = {
  themeConfig: ThemeConfig;
  initialConcepts: Concept[];
  gridSizes: SizeMap;
};

const ListItem = styled.li`
  --small-gap: ${themeValues.gutter.small}px;
  flex: 0 0 auto;
  width: 400px;
  max-width: 90vw;
  padding-left: var(--small-gap);

  /* &:last-child {
    padding-right: var(--small-gap);
  } */

  ${props =>
    props.theme.media('medium')(`
      padding: 0 ${themeValues.gutter.medium}px 0 0;
    `)}
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
  const scrollDistance = useResponsiveScrollDistance();

  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [displayedConcepts, setDisplayedConcepts] =
    useState<Concept[]>(initialConcepts);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    themeConfig.categories[0]?.label || ''
  );

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
      setSelectedCategory(selectedCategoryId);
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
        customScrollDistance={scrollDistance}
        containerRef={scrollContainerRef}
        useShim={true}
      >
        {displayedConcepts.map(concept => (
          <ListItem key={`${selectedCategory}-${concept.id}`}>
            <Theme concept={concept} />
          </ListItem>
        ))}
      </ScrollContainer>
    </Space>
  );
};

export default BrowseByThemes;
