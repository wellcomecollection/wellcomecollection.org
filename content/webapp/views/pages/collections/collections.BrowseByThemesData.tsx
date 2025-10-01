import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import ThemePromo from '@weco/common/views/components/ThemePromo';
import { useConceptImageUrls } from '@weco/content/hooks/useConceptImageUrls';
import { useThemeConcepts } from '@weco/content/hooks/useThemeConcepts';
import { getConceptsByIds } from '@weco/content/pages/collections';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { toConceptLink } from '@weco/content/views/components/ConceptLink';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';

import type { ThemeCategory, ThemeConfig } from './themeBlockCategories';

type BrowseByThemeProps = {
  themeConfig: ThemeConfig;
  initialConcepts: Concept[];
};

const ListItem = styled.li`
  --container-padding: ${props => props.theme.containerPadding.small}px;
  flex: 0 0 90%;
  max-width: 420px;

  padding-left: var(--container-padding);

  &:last-child {
    padding-right: var(--container-padding);
  }

  ${props =>
    props.theme.media('medium')(`
      flex: 0 0 50%;
      padding: 0 var(--container-padding) 0 0;
    `)}
`;

const CategoryLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;
const CategoryLink = styled.button<{ selected: boolean }>`
  background: none;
  border: none;
  color: ${({ selected }) => (selected ? '#007d7e' : '#222')};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-bottom: 2px solid
    ${({ selected }) => (selected ? '#007d7e' : 'transparent')};
  transition: border-color 0.2s;
`;
const BrowseByThemesWrapper = styled.section`
  margin: ${({ theme }) => theme.spaceAtBreakpoints.small.xl}px 0;
`;

const Theme: FunctionComponent<{ concept: Concept }> = ({ concept }) => {
  const linkProps = toConceptLink({ conceptId: concept.id });
  const images = useConceptImageUrls(concept);

  return (
    // TODO fix typing issues
    <ThemePromo
      images={images}
      title={concept.label || concept.displayLabel}
      description={concept.description?.text}
      url={linkProps.href.pathname} // TODO make it take a Link?
    />
  );
};

const BrowseByThemesData: FunctionComponent<BrowseByThemeProps> = ({
  themeConfig,
  initialConcepts,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory>(
    themeConfig.categories[0]
  );
  const { concepts, loading, fetchConcepts } = useThemeConcepts(
    initialConcepts,
    getConceptsByIds
  );

  const handleCategoryClick = (category: ThemeCategory) => {
    setSelectedCategory(category);
    fetchConcepts(category);
  };

  return (
    <BrowseByThemesWrapper data-component="BrowseByTheme">
      <CategoryLinks>
        {themeConfig.categories.map(category => (
          <CategoryLink
            key={category.label}
            selected={category.label === selectedCategory.label}
            onClick={() => handleCategoryClick(category)}
            disabled={loading && category.label === selectedCategory.label}
          >
            {category.label}
          </CategoryLink>
        ))}
      </CategoryLinks>
      <ScrollContainer scrollButtonsAfter={true}>
        {concepts.map(concept => (
          <ListItem key={concept.id}>
            <Theme concept={concept} />
          </ListItem>
        ))}
      </ScrollContainer>
    </BrowseByThemesWrapper>
  );
};

export default BrowseByThemesData;
