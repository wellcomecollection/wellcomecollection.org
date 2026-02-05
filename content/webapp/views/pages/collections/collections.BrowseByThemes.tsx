import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useToggles } from '@weco/common/server-data/Context';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import ScrollContainer from '@weco/common/views/components/ScrollContainer';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import ThemeCard from '@weco/common/views/components/ThemeCard';
import { useConceptImageUrls } from '@weco/content/hooks/useConceptImageUrls';
import { useThemeConcepts } from '@weco/content/hooks/useThemeConcepts';
import { getConceptsByIds } from '@weco/content/pages/collections';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { toConceptLink } from '@weco/content/views/components/ConceptLink';
import MoreLink from '@weco/content/views/components/MoreLink';
import SelectableTags from '@weco/content/views/components/SelectableTags';

import type { ThemeConfig } from './themeBlockCategories';

type BrowseByThemeProps = {
  themeConfig: ThemeConfig;
  initialConcepts: Concept[];
  gridSizes: SizeMap;
};

const ListItem = styled.li`
  --gutter-size: ${props => props.theme.gutter.small};
  flex: 0 0 auto;
  width: 400px;
  max-width: 90vw;
  padding-left: var(--gutter-size);

  &:last-child {
    width: calc(400px + var(--gutter-size));
    max-width: calc(90vw + var(--gutter-size));
    padding-right: var(--gutter-size);
  }

  ${props => {
    const smGutter = props.theme.gutter.medium;
    const paddingCalc = `${props.theme.containerPaddingVw} * 2`;

    return props.theme.media('sm')(`
      --gutter-size: ${smGutter};
      /* 6 columns of 12 at sm breakpoint */
      /* Formula: ((100vw - padding) - (11 × gutter)) / 12 × 6 + (6 × gutter) */
      /* Simplified: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 6)) */
      width: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 6));

      padding: 0 0 0 var(--gutter-size);

      &:nth-child(2) {
        padding-left: 0;
        width: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 5));
      }
      &:last-child {
        padding-right: var(--gutter-size);
        width: calc((100vw - (${paddingCalc}) - (${smGutter} * 11)) / 2 + (${smGutter} * 7));
      }
    `);
  }}

  ${props => {
    const mdGutter = props.theme.gutter.large;
    const lg = props.theme.sizes.lg;
    const paddingCalc = `${props.theme.containerPaddingVw} * 2`;

    return props.theme.media('md')(`
      --gutter-size: ${mdGutter};
      /* 4 columns of 12 at md breakpoint */
      /* Formula: ((100vw - padding) - (11 × gutter)) / 12 × 4 + (4 × gutter) */
      /* Simplified: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / 3 + (${mdGutter} * 4)) */
      width: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / 3 + (${mdGutter} * 4));

      /* Max-width at lg: ((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 × 4 + (${mdGutter} * 4) */
      max-width: calc(((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 * 4 + (${mdGutter} * 4));

      &:nth-child(2){
        width: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / 3 + (${mdGutter} * 3));
        max-width: calc(((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 * 4 + (${mdGutter} * 3));
      }

      &:last-child {
        padding-right: var(--gutter-size);
        width: calc((100vw - (${paddingCalc}) - (${mdGutter} * 11)) / 3 + (${mdGutter} * 5));
        max-width: calc(((${lg} - (${paddingCalc})) - (${mdGutter} * 11)) / 12 * 4 + (${mdGutter} * 5));
      }
    `);
  }}
`;

const Theme: FunctionComponent<{
  concept: Concept;
  categoryLabel: string;
  categoryPosition: number;
  positionInList: number;
}> = ({ concept, categoryLabel, categoryPosition, positionInList }) => {
  const images = useConceptImageUrls(concept);
  const linkProps = toConceptLink({ conceptId: concept.id });

  return linkProps && concept.displayLabel ? (
    <ThemeCard
      images={images}
      title={concept.displayLabel}
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
  const { thematicBrowsing } = useToggles();
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
      label: category.label,
    },
  }));

  const selectedCategoryPosition =
    themeConfig.categories.findIndex(
      cat => cat.label === selectedCategoryLabel
    ) + 1;
  const selectedCategoryUrl = themeConfig.categories.find(
    cat => cat.label === selectedCategoryLabel
  )?.url;

  return (
    <Space
      $v={{
        size: thematicBrowsing ? 'lg' : 'sm',
        properties: thematicBrowsing
          ? ['margin-bottom', 'margin-top']
          : ['margin-top'],
      }}
      data-component="BrowseByThemes"
    >
      <ContaineredLayout gridSizes={gridSize12()}>
        <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
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
        scrollButtonsAfter={!thematicBrowsing}
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

      {thematicBrowsing && selectedCategoryUrl && (
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space $v={{ size: 'md', properties: ['margin-top'] }}>
            <MoreLink
              name={`Browse more ${selectedCategoryLabel.toLowerCase()}`}
              url={selectedCategoryUrl}
            />
          </Space>
        </ContaineredLayout>
      )}
    </Space>
  );
};

export default BrowseByThemes;
