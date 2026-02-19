import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { organisation, user } from '@weco/common/icons';
import {
  ConceptType,
  RelatedConcept,
} from '@weco/content/services/wellcome/catalogue/types';

import CollaboratorCard from './CollaboratorsCards.Card';

const CollaboratorsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: ${props => props.theme.spacingUnits['150']};
  row-gap: ${props => props.theme.spacingUnits['200']};

  ${props => props.theme.media('sm')(`flex-direction: row;`)}
`;

const iconFromCollaboratorType = (type: ConceptType) => {
  if (type === 'Organisation') return organisation;
  return user;
};

const CollaboratorCards: FunctionComponent<{
  collaborators?: RelatedConcept[];
  maxCards?: number;
}> = ({ collaborators, maxCards }) => {
  if (!collaborators || collaborators.length === 0) return null;

  return (
    <CollaboratorsWrapper data-component="collaborator-cards">
      {collaborators.slice(0, maxCards).map((collaborator, index) => (
        <CollaboratorCard
          dataGtmProps={{
            trigger: 'frequent_collaborators',
            'position-in-list': `${index + 1}`,
          }}
          key={collaborator.id}
          href={`/concepts/${collaborator.id}`}
          icon={iconFromCollaboratorType(collaborator.conceptType)}
          label={collaborator.label}
        />
      ))}
    </CollaboratorsWrapper>
  );
};

export default CollaboratorCards;
