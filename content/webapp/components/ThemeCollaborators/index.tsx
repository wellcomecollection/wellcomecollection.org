import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { organisation, user } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import CollaboratorCard from '@weco/content/components/CollaboratorCard';
import {
  ConceptType,
  RelatedConcept,
} from '@weco/content/services/wellcome/catalogue/types';

const COLLABORATOR_COUNT_LIMIT = 3;

const Heading = styled.h2.attrs({
  className: font('intsb', 2),
})``;

const CollaboratorsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacingUnits['4']}px;
  row-gap: ${props => props.theme.spacingUnits['5']}px;

  ${props => props.theme.media('medium')(`flex-direction: row;`)}
`;

type Props = {
  concepts?: RelatedConcept[];
};

const iconFromConceptType = (type: ConceptType) => {
  if (type === 'Organisation') return organisation;
  return user;
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
