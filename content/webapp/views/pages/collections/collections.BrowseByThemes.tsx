import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

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
};

const ListItem = styled.li`
  --gap: ${themeValues.gutter.medium}px;
  flex: 0 0 auto;
  width: 400px;
  max-width: 90vw;
  margin-right: var(--gap);
`;

const Theme: FunctionComponent<{
  concept: Concept;
  categoryLabel: string;
  categoryPosition: number;
  positionInList: number;
}> = ({ concept, categoryLabel, categoryPosition, positionInList }) => {
  const linkProps = toConceptLink({ conceptId: concept.id });
  const images = useConceptImageUrls(concept);
  const url = linkProps.href.pathname;
  const title = concept.displayLabel || concept.label;
  return url && title ? (
    <ThemePromo
      images={images}
      title={title}
      description={concept.description?.text}
      url={url}
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
}) => {
  const { fetchConcepts, setCache } = useThemeConcepts(
    initialConcepts,
    getConceptsByIds
  );

  const [displayedConcepts, setDisplayedConcepts] =
    useState<Concept[]>(initialConcepts);
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string>(
    themeConfig.categories[0]?.label || ''
  );

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
    }
  };

  const tagData = themeConfig.categories.map(category => ({
    id: category.label,
    label: category.label,
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
      <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
        <SelectableTags
          tags={tagData}
          isMultiSelect={false}
          onChange={handleCategoryChange}
        />
      </Space>
      <ScrollContainer scrollButtonsAfter={true}>
        {displayedConcepts.map((concept, index) => (
          <ListItem key={concept.id}>
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
