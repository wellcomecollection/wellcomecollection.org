import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { toConceptLink } from '@weco/content/views/components/ConceptLink';

import {
  AlternativeLabels,
  ConceptDescription,
  ConceptInformation,
  ConceptTitleHeading,
  Container,
  Details,
  Wrapper,
} from './ConceptSearchResult.styles';

type Props = {
  concept: Concept;
  resultPosition: number;
};

const ConceptSearchResult: FunctionComponent<Props> = ({
  concept,
  resultPosition,
}) => {
  // Create a label for the concept type
  const typeLabel = {
    text: concept.type,
    labelColor: 'warmNeutral.300' as const,
  };

  const linkProps = toConceptLink({ conceptId: concept.id as string });

  return (
    <NextLink {...linkProps} legacyBehavior passHref>
      <Wrapper
        as="a"
        data-gtm-trigger="concepts_search_result"
        data-gtm-position-in-list={resultPosition + 1}
        aria-label={`View concept: ${concept.displayLabel || concept.label}`}
      >
        <Container>
          <Details>
            <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
              <LabelsList
                labels={[typeLabel]}
                defaultLabelColor="warmNeutral.300"
              />
            </Space>

            <ConceptTitleHeading>
              {concept.displayLabel || concept.label}
            </ConceptTitleHeading>

            {concept.description && (
              <ConceptDescription>
                {concept.description.text}
              </ConceptDescription>
            )}

            {concept.alternativeLabels &&
              concept.alternativeLabels.length > 0 && (
                <AlternativeLabels>
                  <strong>Also known as:</strong>{' '}
                  {concept.alternativeLabels.join(', ')}
                </AlternativeLabels>
              )}

            <ConceptInformation>
              <span className="searchable-selector">Type: {concept.type}</span>
              {concept.id && (
                <>
                  <span aria-hidden> | </span>
                  <span>ID: {concept.id}</span>
                </>
              )}
            </ConceptInformation>
          </Details>
        </Container>
      </Wrapper>
    </NextLink>
  );
};

export default ConceptSearchResult;
