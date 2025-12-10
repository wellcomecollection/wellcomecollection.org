import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { organisation, user } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { useConceptPageContext } from '@weco/content/contexts/ConceptPageContext';
import {
  ConceptType,
  RelatedConcept,
} from '@weco/content/services/wellcome/catalogue/types';

import CollaboratorCard from './concept.Collaborators.Card';

const COLLABORATOR_COUNT_LIMIT = 4;

const CollaboratorsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: ${props => props.theme.spacingUnits['4']};
  row-gap: ${props => props.theme.spacingUnits['5']};

  ${props => props.theme.media('medium')(`flex-direction: row;`)}
`;

const iconFromConceptType = (type: ConceptType) => {
  if (type === 'Organisation') return organisation;
  return user;
};

const Collaborators: FunctionComponent<{
  concepts?: RelatedConcept[];
}> = ({ concepts }) => {
  const { config } = useConceptPageContext();

  if (!concepts || concepts.length === 0) {
    return null;
  }

  return (
    <section data-id="frequent-collaborators">
      <h2 className={font('brand', 2)} id="frequent-collaborators">
        {config.collaborators.label || 'Frequent collaborators'}
      </h2>
      <CollaboratorsWrapper>
        {concepts.slice(0, COLLABORATOR_COUNT_LIMIT).map((concept, index) => (
          <CollaboratorCard
            dataGtmProps={{
              trigger: 'frequent_collaborators',
              'position-in-list': `${index + 1}`,
            }}
            key={concept.id}
            href={`/concepts/${concept.id}`}
            icon={iconFromConceptType(concept.conceptType)}
            label={concept.label}
          />
        ))}
      </CollaboratorsWrapper>
    </section>
  );
};

export default Collaborators;
