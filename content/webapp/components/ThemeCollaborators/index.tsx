import { FunctionComponent } from 'react';

import { RelatedConcept } from '../../services/wellcome/catalogue/types';
import CollaboratorCard from './CollaboratorCard';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from "@weco/common/utils/classnames";

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

const ThemeCollaborators: FunctionComponent<Props> = ({ concepts }) => {
  if (!concepts || concepts.length === 0) {
    return;
  }

  return (
    <>
      <Heading>Frequent collaborators</Heading>
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

export default ThemeCollaborators;
