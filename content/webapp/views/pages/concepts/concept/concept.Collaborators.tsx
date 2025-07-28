import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { organisation, user } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import {
  ConceptType,
  RelatedConcept,
} from '@weco/content/services/wellcome/catalogue/types';

import CollaboratorCard from './concept.Collaborators.Card';
import { useConceptPageContext } from './concept.context';

const COLLABORATOR_COUNT_LIMIT = 3;

const CollaboratorsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  const { config } = useConceptPageContext();

  if (!concepts || concepts.length === 0) {
    return null;
  }

  return (
    <section data-id="frequent-collaborators">
      <h2 className={font('intsb', 2)} id="frequent-collaborators">
        {config?.collaborators.label || 'Frequent collaborators'}
      </h2>
      <CollaboratorsWrapper>
        {concepts
          .slice(0, config?.collaborators.maxCount || COLLABORATOR_COUNT_LIMIT)
          .map((concept, index) => (
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
