import { FunctionComponent } from 'react';
import styled from 'styled-components';

import PlainList from '@weco/common/views/components/styled/PlainList';
import { Concept } from '@weco/content/services/wellcome/catalogue/types';

import ConceptSearchResult from '../ConceptSearchResult';

type Props = {
  concepts: Concept[];
};

const SearchResultUnorderedList = styled(PlainList)`
  display: flex;
  flex-wrap: wrap;
`;

const SearchResultListItem = styled.li`
  flex-basis: 100%;
  max-width: 100%;

  &:first-child {
    border-top: 0;

    & > a {
      padding-top: 0;
    }
  }

  &:last-child a {
    padding-bottom: 0;
  }
`;

const ConceptsSearchResults: FunctionComponent<Props> = ({ concepts }) => {
  return (
    <SearchResultUnorderedList 
      data-component="concepts-search-results"
      data-testid="concepts-search-results"
    >
      {concepts.map((result, i) => (
        <SearchResultListItem data-testid="concept-search-result" key={result.id}>
          <ConceptSearchResult concept={result} resultPosition={i} />
        </SearchResultListItem>
      ))}
    </SearchResultUnorderedList>
  );
};

export default ConceptsSearchResults;