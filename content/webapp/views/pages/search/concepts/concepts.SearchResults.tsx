import { FunctionComponent } from 'react';

import { font } from '@weco/common/utils/classnames';
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
  Link,
  SearchResultListItem,
  SearchResultUnorderedList,
  Wrapper,
} from './concepts.SearchResults.styles';

const ConceptSearchResult: FunctionComponent<{
  concept: Concept;
}> = ({ concept }) => {
  if (!concept.id) return null;

  // Create a label for the concept type
  const typeLabel = {
    text: concept.type,
    labelColor: 'warmNeutral.300' as const,
  };

  const linkProps = toConceptLink({ conceptId: concept.id });

  return (
    <Link {...linkProps}>
      <Wrapper>
        <Container>
          <Details>
            <Space $v={{ size: '2xs', properties: ['margin-bottom'] }}>
              <LabelsList
                labels={[typeLabel]}
                defaultLabelColor="warmNeutral.300"
              />
            </Space>

            <ConceptTitleHeading>{concept.displayLabel}</ConceptTitleHeading>

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
              <span className={font('sans-bold', -1)}>
                Type: {concept.type}
              </span>
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
    </Link>
  );
};

const ConceptsSearchResults: FunctionComponent<{ concepts: Concept[] }> = ({
  concepts,
}) => {
  if (concepts.length === 0) return null;

  return (
    <SearchResultUnorderedList
      data-component="concepts-search-results"
      data-testid="concepts-search-results"
    >
      {concepts.map(result => (
        <SearchResultListItem
          data-testid="concept-search-result"
          key={result.id}
        >
          <ConceptSearchResult concept={result} />
        </SearchResultListItem>
      ))}
    </SearchResultUnorderedList>
  );
};

export default ConceptsSearchResults;
