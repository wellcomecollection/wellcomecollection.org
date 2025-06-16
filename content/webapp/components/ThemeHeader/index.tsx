import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import ThemeAlternativeLabels from '@weco/content/components/ThemeHeader/ThemeAlternativeLabels';
import ThemeRelatedConceptsGroup from '@weco/content/components/ThemeRelatedConceptsGroup';
import ThemeSourcedDescription from '@weco/content/components/ThemeSourcedDescription';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';

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
          <ThemeAlternativeLabels
            alternativeLabels={concept.alternativeLabels}
          />
        )}
        {concept.description && (
          <ThemeDescription>
            <ThemeSourcedDescription
              description={capitalize(concept.description)}
              source="Wikidata"
              // TODO: Replace with real link once available from the API
              href="https://www.wikidata.org/wiki/Wikidata:Main_Page"
            />
          </ThemeDescription>
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
                label="Part of"
                labelType="inline"
                relatedConcepts={narrowerThan}
              />
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
