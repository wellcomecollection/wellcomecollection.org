import { FunctionComponent, useState } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { useToggles } from '@weco/common/server-data/Context';
import { dasherize, pluralize } from '@weco/common/utils/grammar';
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

type BrowseByThemeProps = {
  gridSizes: SizeMap;
  themeCardsListSlices: RawThemeCardsListSlice[];
};

type ApprovedThemeCategories =
  | 'People and organisations'
  | 'Subjects'
  | 'Places'
  | 'Types and techniques';

const approvedThemeCategories: ApprovedThemeCategories[] = [
  'People and organisations',
  'Subjects',
  'Places',
  'Types and techniques',
];

const isApprovedThemeCategory = (
  value: string
): value is ApprovedThemeCategories =>
  approvedThemeCategories.includes(value as ApprovedThemeCategories);

const BrowseByThemes: FunctionComponent<BrowseByThemeProps> = ({
  gridSizes,
  themeCardsListSlices,
}) => {
  const { thematicBrowsing } = useToggles();

  // Transform slices but ensure we only keep those with a title
  // as the title is used as the category label
  const transformedThemeCardsListSlices = themeCardsListSlices
    .map(transformThemeCardsList)
    .filter(
      (
        slice
      ): slice is typeof slice & {
        value: { title: ApprovedThemeCategories | 'Featured' };
      } => Boolean(slice.value.title)
    );

  const initialSlice = transformedThemeCardsListSlices[0];

  const [conceptIds, setConceptIds] = useState<string[]>(
    initialSlice?.value.conceptIds || []
  );
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string>(
    initialSlice?.value.title || 'Featured'
  );
  const [announcement, setAnnouncement] = useState('');

  if (transformedThemeCardsListSlices.length === 0) return null;

  const handleCategoryChange = (clickedCategory: string[]) => {
    const category = transformedThemeCardsListSlices.find(
      cat => cat.value.title === clickedCategory[0]
    );

    if (category) {
      setSelectedCategoryLabel(category.value.title);
      setConceptIds(category.value.conceptIds);
    }
  };

  const handleConceptsFetched = ({ count }: { count: number }) => {
    setAnnouncement(
      `Showing ${count} ${selectedCategoryLabel.toLowerCase()} ${pluralize(count, 'theme')}`
    );
  };

  const tagData = transformedThemeCardsListSlices.map(category => ({
    id: category.value.title,
    label: category.value.title,
    gtmData: {
      trigger: 'selectable_tag',
      label: category.value.title,
    },
  }));

  const selectedCategoryPosition =
    transformedThemeCardsListSlices.findIndex(
      cat => cat.value.title === selectedCategoryLabel
    ) + 1;

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

      {thematicBrowsing && isApprovedThemeCategory(selectedCategoryLabel) && (
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space $v={{ size: 'md', properties: ['margin-top'] }}>
            <MoreLink
              name={`Browse more ${selectedCategoryLabel.toLowerCase()}`}
              url={`${prismicPageIds.collections}/${dasherize(selectedCategoryLabel)}`}
            />
          </Space>
        </ContaineredLayout>
      )}
    </Space>
  );
};

export default BrowseByThemes;
