import { FunctionComponent } from 'react';

import { RelatedConcept } from '../../services/wellcome/catalogue/types';
import CollaboratorCard from './CollaboratorCard';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';

const COLLABORATOR_COUNT_LIMIT = 3;

const CollaboratorsWrapper = styled(Space)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacingUnits['3']}px;

  ${props =>
    props.theme.media('medium')(`
      flex-direction: row;
  `)}
`;

type Props = {
  concepts: RelatedConcept[] | undefined;
};

const Collaborators: FunctionComponent<Props> = ({ concepts }) => {
  if (!concepts || concepts.length === 0) {
    return null;
  }

  return (
    <>
      <h2>Frequent collaborators</h2>
      <CollaboratorsWrapper>
        {concepts.slice(0, COLLABORATOR_COUNT_LIMIT).map(concept => (
          <CollaboratorCard
            id={concept.id}
            type={concept.conceptType}
            label={concept.label}
          />
        ))}
      </CollaboratorsWrapper>
    </>
  );
};

export default Collaborators;
