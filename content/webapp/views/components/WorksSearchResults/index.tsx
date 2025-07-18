import { FunctionComponent } from 'react';
import styled from 'styled-components';

import PlainList from '@weco/common/views/components/styled/PlainList';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';

import WorksSearchResult from './WorksSearchResults.Result';

type Props = {
  works: WorkBasic[];
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

const WorksSearchResults: FunctionComponent<Props> = ({ works }) => {
  return (
    <SearchResultUnorderedList>
      {works.map((result, i) => (
        <SearchResultListItem data-testid="work-search-result" key={result.id}>
          <WorksSearchResult work={result} resultPosition={i} />
        </SearchResultListItem>
      ))}
    </SearchResultUnorderedList>
  );
};

export default WorksSearchResults;
