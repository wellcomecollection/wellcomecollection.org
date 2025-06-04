import { FunctionComponent } from 'react';

import {
  ConceptType,
  RelatedConcept,
} from '../../services/wellcome/catalogue/types';
import CollaboratorCard from './CollaboratorCard';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import { user } from '@weco/common/icons';

const COLLABORATOR_COUNT_LIMIT = 3;

const Heading = styled.h2.attrs({
  className: font('intsb', 2),
})``;

const CollaboratorsWrapper = styled(Space)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacingUnits['4']}px;

  ${props =>
    props.theme.media('medium')(`
      flex-direction: row;
      gap: ${props => props.theme.spacingUnits['5']}px;
  `)}
`;

type Props = {
  concepts: RelatedConcept[] | undefined;
};

const iconFromConceptType = (type: ConceptType) => {
  if (['Person', 'Agent'].includes(type)) return user;

  // TODO: We don't have an organisation icon at the moment.
  if (type === 'Organisation') return user;
};

const ThemeCollaborators: FunctionComponent<Props> = ({ concepts }) => {
  if (!concepts || concepts.length === 0) {
    return null;
  }

  return (
    <>
      <Heading>Frequent collaborators</Heading>
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

export default ThemeCollaborators;
