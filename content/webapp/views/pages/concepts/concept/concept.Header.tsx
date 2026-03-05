import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { capitalize } from '@weco/common/utils/grammar';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import Breadcrumb, {
  getBreadcrumbItems,
} from '@weco/common/views/components/Breadcrumb';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import Layout, {
  gridSize10,
  gridSize8,
} from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { useConceptPageContext } from '@weco/content/contexts/ConceptPageContext';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import SourcedDescription from '@weco/content/views/components/SourcedDescription';

import RelatedConceptsGroup from './concept.RelatedConceptsGroup';

const ConceptHero = styled(Space).attrs({
  $v: { size: 'sm', properties: ['padding-top'] },
})`
  background-color: ${props => props.theme.color('accent.lightGreen')};
  padding-bottom: ${props => props.theme.gutter.xlarge};
`;

const AlternativeLabels = styled(Space).attrs({
  className: font('sans', -2),
  $v: { size: 'sm', properties: ['margin-bottom'] },
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacingUnits['100']}px;
  color: ${props => props.theme.color('neutral.700')};
`;

const AlternativeLabel = styled.span.attrs({
  className: font('sans', -2),
})`
  border-right: 1px solid ${props => props.theme.color('neutral.700')};
  padding-right: ${props => props.theme.spacingUnits['100']};

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
  hasImages?: boolean;
}> = ({ concept, hasImages }) => {
  const { themePagesAllFields, thematicBrowsing } = useToggles();
  const { config } = useConceptPageContext();
  const router = useRouter();

  const { narrowerThan, fieldsOfWork, people, relatedTo, broaderThan } =
    concept.relatedConcepts || {};

  const getBreadcrumbParent = (): { text: string; url: string } | undefined => {
    const baseUrl = `${router.basePath}/${prismicPageIds.collections}`;

    switch (concept.type) {
      case 'Genre':
      case 'Concept':
      case 'Meeting':
      case 'Period':
        return {
          text: 'Types and techniques',
          url: `${baseUrl}/types-and-techniques`,
        };
      case 'Subject':
        return {
          text: 'Subjects',
          url: `${baseUrl}/subjects`,
        };
      case 'Person':
      case 'Organisation':
      case 'Agent':
        return {
          text: 'People and organisations',
          url: `${baseUrl}/people-and-organisations`,
        };
      case 'Place':
        return {
          text: 'Places',
          url: `${baseUrl}/places`,
        };
      default:
        return undefined;
    }
  };

  return (
    <>
      <ConceptHero>
        <Container>
          {thematicBrowsing && (
            <Space
              $v={{ size: 'sm', properties: ['margin-top', 'margin-bottom'] }}
            >
              <Breadcrumb
                items={
                  getBreadcrumbItems(
                    'collections',
                    [getBreadcrumbParent()].filter(isNotUndefined)
                  ).items
                }
              />
            </Space>
          )}

          <Layout gridSizes={gridSize10(false)}>
            <h1 className={font('brand-bold', 4)}>{concept.displayLabel}</h1>
            {themePagesAllFields && (
              <ThemeAlternativeLabels
                alternativeLabels={concept.alternativeLabels}
              />
            )}
          </Layout>

          {concept.description &&
            (config.sourcedDescription.display ||
              concept.description.sourceLabel === 'weco-authority') && (
              <Layout gridSizes={gridSize8(false)}>
                <div className={`${font('sans', 1)} body-text`}>
                  <SourcedDescription
                    description={capitalize(concept.description.text)}
                    source={concept.description.sourceLabel}
                    href={concept.description.sourceUrl}
                  />
                </div>
              </Layout>
            )}

          <>
            {config.fieldOrArea.display && (
              <RelatedConceptsGroup
                dataGtmTriggerName="field_of_work"
                label={config.fieldOrArea.label || 'Field of work'}
                labelType="inline"
                relatedConcepts={fieldsOfWork}
              />
            )}

            {config.partOf.display && (
              <RelatedConceptsGroup
                label={config.partOf.label || 'Part of'}
                labelType="inline"
                relatedConcepts={narrowerThan}
              />
            )}

            {themePagesAllFields && (
              <>
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

      <DecorativeEdge
        variant="wobbly"
        backgroundColor={hasImages ? 'neutral.700' : 'white'}
      />
    </>
  );
};
export default ThemeHeader;
