import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import ThemeCard from '@weco/common/views/components/ThemeCard';
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
  --gutter-size: ${props => props.theme.gutter.small}px;
  flex: 0 0 auto;
  width: 400px;
  max-width: 90vw;
  padding-left: var(--gutter-size);

  &:last-child {
    width: calc(400px + var(--gutter-size));
    max-width: calc(90vw + var(--gutter-size));
    padding-right: var(--gutter-size);
  }

  ${props =>
    props.theme.media('medium')(`
      --gutter-size: ${props.theme.gutter.medium}px;
      /* 6 columns of 12 at medium breakpoint */
      /* Formula: ((100vw - 84px padding) - (11 × 24px gutters)) / 12 × 6 + (6 × 24px gutters) */
      /* The 6th gutter accounts for the gap after the card, matching grid behaviour */
      /* Simplified: ((100vw - 84px - 264px) / 12 × 6) + 144px = calc(50vw - 30px) */
      width: calc(50vw - 30px);

      padding: 0 0 0 var(--gutter-size);

      &:nth-child(2) {
        padding-left: 0;
        width: calc(50vw - (30px + var(--gutter-size)));
      }
      &:last-child {
        padding-right: var(--gutter-size);
        width: calc(50vw - (30px - var(--gutter-size)));
      }
    `)}

  ${props =>
    props.theme.media('large')(`
      --gutter-size: ${props.theme.gutter.large}px;
      /* 4 columns of 12 at large breakpoint */
      /* Formula: ((100vw - 120px padding) - (11 × 30px gutters)) / 12 × 4 + (4 × 30px gutters) */
      /* The 4th gutter accounts for the gap after the card, matching grid behaviour */
      /* Simplified: ((100vw - 120px - 330px) / 12 × 4) + 120px = calc(33.333vw - 30px) */
      width: calc(33.333vw - 30px);

      /* Max-width at xlarge: ((1338px - 120px - 330px) / 12 × 4) + 120px = 416px */
      max-width: ${((props.theme.sizes.xlarge - 120 - 330) / 12) * 4 + 120}px;

      &:nth-child(2){
        width: calc(33.333vw - (30px + var(--gutter-size)));
        max-width: ${((props.theme.sizes.xlarge - 120 - 330) / 12) * 4 + 90}px;
      }

      &:last-child {
        padding-right: var(--gutter-size);
        width: calc(33.333vw - (30px - var(--gutter-size)));
        max-width: ${((props.theme.sizes.xlarge - 120 - 330) / 12) * 4 + 150}px;
      }
    `)}
`;

const Theme: FunctionComponent<{
  concept: Concept;
  categoryLabel: string;
  categoryPosition: number;
  positionInList: number;
}> = ({ concept, categoryLabel, categoryPosition, positionInList }) => {
  const images = useConceptImageUrls(concept);
  const linkProps = toConceptLink({ conceptId: concept.id });
  const title = concept.displayLabel || concept.label;
  return linkProps && title ? (
    <ThemeCard
      images={images}
      title={title}
      description={concept.description?.text}
      linkProps={linkProps}
      dataGtmProps={{
        trigger: 'theme_promo_card',
        'category-label': categoryLabel,
        'category-position-in-list': String(categoryPosition),
        id: concept.id,
        'position-in-list': String(positionInList),
      }}
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
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string>(
    themeConfig.categories[0]?.label || ''
  );
  const [announcement, setAnnouncement] = useState('');

  // Set the cache with the first category and display it
  useEffect(() => {
    const firstLabel = themeConfig.categories[0]?.label;
    if (firstLabel) {
      setCache(firstLabel, initialConcepts);
      setSelectedCategoryLabel(firstLabel);
    }
    setDisplayedConcepts(initialConcepts);
  }, [initialConcepts, themeConfig.categories, setCache]);

  const handleCategoryChange = async (selectedIds: string[]) => {
    const selectedCategoryId = selectedIds[0];
    const category = themeConfig.categories.find(
      cat => cat.label === selectedCategoryId
    );
    if (category) {
      setSelectedCategoryLabel(category.label);
      const result = await fetchConcepts(category);
      setDisplayedConcepts(result);
      setAnnouncement(
        `Showing ${result.length} ${category.label.toLowerCase()} ${result.length === 1 ? 'theme' : 'themes'}`
      );
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
    gtmData: {
      trigger: 'selectable_tag',
    },
  }));

  const selectedCategoryPosition =
    themeConfig.categories.findIndex(
      cat => cat.label === selectedCategoryLabel
    ) + 1;

  return (
    <Space
      $v={{ size: 'm', properties: ['margin-top'] }}
      data-component="BrowseByThemes"
    >
      <ContaineredLayout gridSizes={gridSize12()}>
        <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
          <div className="visually-hidden" aria-live="polite">
            {announcement}
          </div>

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
        containerRef={scrollContainerRef}
        useShim={true}
      >
        {displayedConcepts.map((concept, index) => (
          <ListItem key={`${selectedCategoryLabel}-${concept.id}`}>
            <Theme
              concept={concept}
              categoryLabel={selectedCategoryLabel}
              categoryPosition={selectedCategoryPosition}
              positionInList={index + 1}
            />
          </ListItem>
        ))}
      </ScrollContainer>
    </Space>
  );
};

export default BrowseByThemes;
