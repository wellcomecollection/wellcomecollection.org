import { FunctionComponent, useState } from 'react';

import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { useToggles } from '@weco/common/server-data/Context';
import { pluralize } from '@weco/common/utils/grammar';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { transformThemeCardsList } from '@weco/content/services/prismic/transformers/body';
import MoreLink from '@weco/content/views/components/MoreLink';
import SelectableTags from '@weco/content/views/components/SelectableTags';
import ThemeCardsList from '@weco/content/views/components/ThemeCardsList';

import type { ThemeConfig } from './themeBlockCategories';

type BrowseByThemeProps = {
  themeConfig: ThemeConfig;
  gridSizes: SizeMap;
  themesCardsListSlices: RawThemeCardsListSlice[];
};

const BrowseByThemes: FunctionComponent<BrowseByThemeProps> = ({
  themeConfig,
  gridSizes,
  themesCardsListSlices,
}) => {
  const { thematicBrowsing } = useToggles();
  const transformedThemeCardsListSlices = themesCardsListSlices.map(
    transformThemeCardsList
  );

  const [conceptIds, setConceptIds] = useState<string[]>(
    transformedThemeCardsListSlices?.[0]?.value.conceptIds || []
  );
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string>(
    themeConfig.categories[0]?.label || ''
  );
  const [announcement, setAnnouncement] = useState('');

  const handleCategoryChange = (selectedIds: string[]) => {
    const selectedCategoryId = selectedIds[0];
    const category = themeConfig.categories.find(
      cat => cat.label === selectedCategoryId
    );
    if (category) {
      setSelectedCategoryLabel(category.label);
      setConceptIds(category.concepts);
    }
  };

  const handleConceptsFetched = ({ count }: { count: number }) => {
    setAnnouncement(
      `Showing ${count} ${selectedCategoryLabel.toLowerCase()} ${pluralize(count, 'theme')}`
    );
  };

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
        conceptIds={conceptIds}
        gridSizes={gridSizes}
        gtmData={{
          'category-label': selectedCategoryLabel,
          'category-position-in-list': `${selectedCategoryPosition}`,
        }}
        onConceptsFetched={handleConceptsFetched}
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
