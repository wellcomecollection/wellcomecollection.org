import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import { useConceptImageUrls } from '@weco/content/hooks/useConceptImageUrls';
import { useThemeConcepts } from '@weco/content/hooks/useThemeConcepts';

import { getConceptsByIds } from '@weco/content/pages/collections';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import type { Image } from '@weco/content/services/wellcome/catalogue/types';

import { toConceptLink } from '@weco/content/views/components/ConceptLink';
import type { ThemeCategory, ThemeConfig } from './themeBlockCategories';

type BrowseByThemeProps = {
  themeConfig: ThemeConfig;
  initialConcepts: Concept[];
};

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
const ConceptList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
`;
const ConceptCard = styled.li`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #00000014;
  padding: 1rem 1.5rem;
  min-width: 180px;
  max-width: 220px;
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const ConceptTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
`;
const ConceptDescription = styled.p`
  margin: 0;
  color: #444;
  font-size: 0.95rem;
`;
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.25rem;
  width: 100%;
  margin-bottom: 0.75rem;
  overflow: hidden;
`;

const ThemeConceptCard: FunctionComponent<{ concept: Concept }> = ({
  concept,
}) => {
  const linkProps = toConceptLink({ conceptId: concept.id });
  const images = useConceptImageUrls(concept);

  const toImageUrl = (img?: Image) => {
    if (!img) return '';
    const raw = img.thumbnail?.url || img.locations?.[0]?.url || '';
    try {
      return convertIiifImageUri(raw, 250);
    } catch (e) {
      return raw;
    }
  };

  return (
    <ConceptCard>
      <Link
        {...linkProps}
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: 'block', width: '100%' }}
      >
        <ImageGrid>
          {images.map((img, i) => {
            const url = toImageUrl(img);
            return (
              <img
                key={(url || img.id) + i}
                src={url}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  display: 'block',
                }}
              />
            );
          })}
        </ImageGrid>
      </Link>
      <ConceptTitle>
        {concept.label || concept.displayLabel || concept.id}
      </ConceptTitle>
      {concept.description?.text && (
        <ConceptDescription>{concept.description.text}</ConceptDescription>
      )}
    </ConceptCard>
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
      <ConceptList>
        {concepts.map(concept => (
          <ThemeConceptCard key={concept.id} concept={concept} />
        ))}
      </ConceptList>
      {loading && <div>Loading…</div>}
    </BrowseByThemesWrapper>
  );
};

export default BrowseByThemesData;
