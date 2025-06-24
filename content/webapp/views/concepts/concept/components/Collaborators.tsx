import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { organisation, user } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import CollaboratorCard from '@weco/content/components/CollaboratorCard';
import {
  ConceptType,
  RelatedConcept,
} from '@weco/content/services/wellcome/catalogue/types';

const COLLABORATOR_COUNT_LIMIT = 3;

const CollaboratorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacingUnits['4']}px;
  row-gap: ${props => props.theme.spacingUnits['5']}px;

  ${props => props.theme.media('medium')(`flex-direction: row;`)}
`;

const iconFromConceptType = (type: ConceptType) => {
  if (type === 'Organisation') return organisation;
  return user;
};

const Collaborators: FunctionComponent<{
  concepts?: RelatedConcept[];
}> = ({ concepts }) => {
  if (!concepts || concepts.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className={font('intsb', 2)}>Frequent collaborators</h2>
      <CollaboratorsWrapper>
        {concepts.slice(0, COLLABORATOR_COUNT_LIMIT).map(concept => (
          <CollaboratorCard
            key={concept.id}
            href={`/concepts/${concept.id}`}
            icon={iconFromConceptType(concept.conceptType)}
            label={concept.label}
          />
        ))}
      </CollaboratorsWrapper>
    </>
  );
};

export default Collaborators;
