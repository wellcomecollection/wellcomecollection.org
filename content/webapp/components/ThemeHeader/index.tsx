import { FunctionComponent } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import { Container } from '@weco/common/views/components/styled/Container';
import { capitalize } from '@weco/common/utils/grammar';
import { Concept } from '../../services/wellcome/catalogue/types';
import styled from 'styled-components';
import ThemeRelatedConceptsGroup from '../ThemeRelatedConceptsGroup';
import { font } from '@weco/common/utils/classnames';
import ThemeAlternativeLabels from './ThemeAlternativeLabels';
import { useToggles } from '@weco/common/server-data/Context';

const ConceptHero = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('accent.lightGreen')};
`;

const Title = styled.h1.attrs({ className: font('wb', 1) })`
  margin-bottom: 1rem;
`;

type Props = {
  concept: Concept;
};

const ThemeHeader: FunctionComponent<Props> = ({ concept }) => {
  const { themePagesAllFields } = useToggles();

  const { narrowerThan, fieldsOfWork, people, relatedTo, broaderThan } =
    concept.relatedConcepts || {};

  return (
    <ConceptHero>
      <Container>
        <Space $v={{ size: 's', properties: ['margin-top', 'margin-bottom'] }}>
          <Title>{concept.label}</Title>
          {themePagesAllFields && (
            <>
              <ThemeAlternativeLabels
                alternativeLabels={concept.alternativeLabels}
              />
              <ThemeRelatedConceptsGroup
                label="Part of"
                labelType="inline"
                relatedConcepts={narrowerThan}
              />
            </>
          )}
          {concept.description && <p>{capitalize(concept.description)}</p>}
        </Space>
        <>
          <ThemeRelatedConceptsGroup
            label="Field of work"
            labelType="inline"
            relatedConcepts={fieldsOfWork}
          />
          {themePagesAllFields && (
            <>
              <ThemeRelatedConceptsGroup
                label="Notable people in this field"
                labelType="heading"
                relatedConcepts={people}
              />
              <ThemeRelatedConceptsGroup
                label="Related to"
                labelType="heading"
                relatedConcepts={relatedTo}
              />
              <ThemeRelatedConceptsGroup
                label="Broader than"
                labelType="heading"
                relatedConcepts={broaderThan}
              />
            </>
          )}
        </>
      </Container>
    </ConceptHero>
  );
};
export default ThemeHeader;
