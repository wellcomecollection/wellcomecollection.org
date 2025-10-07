import { FunctionComponent, useEffect, useState } from 'react';
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

const Shim = styled.li<{ $gridValues: number[] }>`
  display: none;

  --container-padding: ${props => props.theme.containerPadding.small}px;
  --number-of-columns: ${props => (12 - props.$gridValues[0]) / 2};
  --gap-value: ${props => props.theme.gutter.small}px;
  --container-width: calc(100% - (var(--container-padding) * 2));
  --container-width-without-gaps: calc(
    (var(--container-width) - (var(--gap-value) * 11))
  );
  min-width: calc(
    var(--container-padding) +
      (
        var(--number-of-columns) *
          ((var(--container-width-without-gaps) / 12) + var(--gap-value))
      )
  );

  ${props =>
    props.theme.media('medium')(`
      display: block;
      --container-padding: ${props.theme.containerPadding.medium}px;
      --number-of-columns: ${(12 - props.$gridValues[1]) / 2};
      --gap-value: ${props.theme.gutter.medium}px;
  `)}

  ${props =>
    props.theme.media('large')(`
      --container-padding: ${props.theme.containerPadding.large}px;
      --number-of-columns: ${(12 - props.$gridValues[2]) / 2};
      --gap-value: ${props.theme.gutter.large}px;
  `)}

  ${props =>
    props.theme.media('xlarge')(`
      --container-padding: ${props.theme.containerPadding.xlarge}px;
      --container-width: calc(${props.theme.sizes.xlarge}px - (var(--container-padding) * 2));
      --left-margin-width: calc((100% - ${props.theme.sizes.xlarge}px) / 2);
      --number-of-columns: ${(12 - props.$gridValues[3]) / 2};
      --gap-value: ${props.theme.gutter.xlarge}px;

      min-width: calc(
        var(--left-margin-width) + var(--container-padding) +
          (
            var(--number-of-columns) *
              ((var(--container-width-without-gaps) / 12) + var(--gap-value))
          )
      );
  `)}
`;

const ListItem = styled.li`
  --gap: ${themeValues.gutter.medium}px;
  flex: 0 0 auto;
  width: 400px;
  max-width: 90vw;
  margin-right: var(--gap);
`;

const Theme: FunctionComponent<{ concept: Concept }> = ({ concept }) => {
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

  const tagData = themeConfig.categories.map(category => ({
    id: category.label,
    label: category.label,
  }));

  const gridValues = Object.values(gridSizes).map(v => v[0]);

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
      >
        <Shim $gridValues={gridValues}></Shim>
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
