import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { useToggles } from '@weco/common/server-data/Context';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { useThemeConcepts } from '@weco/content/hooks/useThemeConcepts';
import { getConceptsByIds } from '@weco/content/services/wellcome/catalogue/concepts';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import MoreLink from '@weco/content/views/components/MoreLink';
import SelectableTags from '@weco/content/views/components/SelectableTags';
import ThemeCardsList from '@weco/content/views/components/ThemeCardsList';

import type { ThemeConfig } from './themeBlockCategories';

type BrowseByThemeProps = {
  themeConfig: ThemeConfig;
  initialConcepts: Concept[];
  gridSizes: SizeMap;
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

      <ThemeCardsList
        conceptIds={displayedConcepts.map(concept => concept.id)}
        gridSizes={gridSizes}
        gtmData={{
          'category-label': selectedCategoryLabel,
          'category-position-in-list': `${selectedCategoryPosition}`,
        }}
      />

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
