import { FunctionComponent } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import { Container } from '@weco/common/views/components/styled/Container';
import { capitalize } from '@weco/common/utils/grammar';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import styled from 'styled-components';
import ThemeRelatedConceptsGroup from '@weco/content/components/ThemeRelatedConceptsGroup';
import { font } from '@weco/common/utils/classnames';
import ThemeAlternativeLabels from '@weco/content/components/ThemeHeader/ThemeAlternativeLabels';
import { useToggles } from '@weco/common/server-data/Context';

const ConceptHero = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('accent.lightGreen')};
`;

const Title = styled(Space).attrs({
  as: 'h1',
  className: font('wb', 1),
  $v: { size: 'xs', properties: ['margin-bottom'] },
})``;

const ThemeDescription = styled(Space).attrs({
  as: 'p',
  className: `${font('intr', 3)} body-text`,
  $v: { size: 'l', properties: ['margin-bottom'] },
})``;

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
        {concept.description && (
          <ThemeDescription>{capitalize(concept.description)}</ThemeDescription>
        )}
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
