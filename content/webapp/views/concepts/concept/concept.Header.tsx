import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import SourcedDescription from '@weco/common/views/components/SourcedDescription';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';

import RelatedConceptsGroup from './concept.RelatedConceptsGroup';

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

const AlternativeLabels = styled(Space).attrs({
  className: font('intr', 6),
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacingUnits['3']}px;
  color: ${props => props.theme.color('neutral.700')};
`;

const AlternativeLabel = styled.span.attrs({
  className: font('intr', 6),
})`
  border-right: 1px solid ${props => props.theme.color('neutral.700')};
  padding-right: ${props => props.theme.spacingUnits['3']}px;

  &:last-of-type {
    border-right: 0;
  }
`;

const ThemeAlternativeLabels: FunctionComponent<{
  alternativeLabels?: string[];
}> = ({ alternativeLabels }) => {
  if (!alternativeLabels || alternativeLabels.length === 0) {
    return null;
  }

  return (
    <AlternativeLabels>
      {alternativeLabels.map(label => (
        <AlternativeLabel key={label}>{capitalize(label)}</AlternativeLabel>
      ))}
    </AlternativeLabels>
  );
};

const ThemeHeader: FunctionComponent<{
  concept: Concept;
}> = ({ concept }) => {
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
            <SourcedDescription
              description={capitalize(concept.description.text)}
              source={concept.description.sourceLabel}
              href={concept.description.sourceUrl}
            />
          </ThemeDescription>
        )}
        <>
          {(concept.type === 'Person' || themePagesAllFields) && (
            <RelatedConceptsGroup
              label="Field of work"
              labelType="inline"
              relatedConcepts={fieldsOfWork}
            />
          )}
          {themePagesAllFields && (
            <>
              <RelatedConceptsGroup
                label="Part of"
                labelType="inline"
                relatedConcepts={narrowerThan}
              />
              <RelatedConceptsGroup
                label="Notable people in this field"
                labelType="heading"
                relatedConcepts={people}
              />
              <RelatedConceptsGroup
                label="Related to"
                labelType="heading"
                relatedConcepts={relatedTo}
              />
              <RelatedConceptsGroup
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
