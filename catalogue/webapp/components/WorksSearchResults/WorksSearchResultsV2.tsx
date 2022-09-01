import { FC } from 'react';
import styled from 'styled-components';
import WorksSearchResultV2 from '../WorksSearchResult/WorksSearchResultV2';
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';

type Props = {
  works: CatalogueResultsList<Work>;
};

const SearchResultUnorderedList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
`;

const SearchResultListItem = styled.li`
  flex-basis: 100%;
  max-width: 100%;
  border-top: 1px solid ${props => props.theme.color('smoke')};

  &:first-child {
    border-top: 0;
  }
`;

const WorkSearchResultsV2: FC<Props> = ({ works }: Props) => {
  return (
    <SearchResultUnorderedList>
      {works.results.map((result, i) => (
        <SearchResultListItem key={result.id}>
          <WorksSearchResultV2 work={result} resultPosition={i} />
        </SearchResultListItem>
      ))}
    </SearchResultUnorderedList>
  );
};

export default WorkSearchResultsV2;
