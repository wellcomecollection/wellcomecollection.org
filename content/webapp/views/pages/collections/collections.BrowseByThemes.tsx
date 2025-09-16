import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import type { Concept } from '@weco/content/pages/collections';

const BrowseByThemesWrapper = styled.section`
  margin: ${props => props.theme.spaceAtBreakpoints.small.xl}px 0;
`;

const Title = styled.h2`
  ${font('wb', 3)};
  margin-bottom: ${props => props.theme.spaceAtBreakpoints.small.l}px;
`;

export type BrowseByThemeProps = {
  featuredConcepts: Concept[];
};

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

const BrowseByThemes: FunctionComponent<BrowseByThemeProps> = ({
  featuredConcepts,
}) => {
  return (
    <BrowseByThemesWrapper data-component="BrowseByTheme">
      <ConceptList>
        {featuredConcepts.map(concept => (
          <ConceptCard key={concept.id}>
            <ConceptTitle>
              {concept.label || concept.displayLabel || concept.id}
            </ConceptTitle>
            {concept.description && concept.description.text && (
              <ConceptDescription>
                {concept.description.text}
              </ConceptDescription>
            )}
          </ConceptCard>
        ))}
      </ConceptList>
    </BrowseByThemesWrapper>
  );
};

export default BrowseByThemes;
