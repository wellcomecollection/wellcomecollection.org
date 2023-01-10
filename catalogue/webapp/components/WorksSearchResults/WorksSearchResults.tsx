import { FunctionComponent } from 'react';
import styled from 'styled-components';
import WorksSearchResult from '../WorksSearchResult/WorksSearchResult';
import { Work } from '@weco/common/model/catalogue';
import PlainList from '@weco/common/views/components/styled/PlainList';

type Props = {
  works: Work[];
};

const SearchResultUnorderedList = styled(PlainList)`
  display: flex;
  flex-wrap: wrap;
`;

const SearchResultListItem = styled.li`
  flex-basis: 100%;
  max-width: 100%;
  border-top: 1px solid ${props => props.theme.color('neutral.300')};

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

const WorksSearchResults: FunctionComponent<Props> = ({ works }: Props) => {
  return (
    <SearchResultUnorderedList>
      {works.map((result, i) => (
        <SearchResultListItem key={result.id}>
          <WorksSearchResult work={result} resultPosition={i} />
        </SearchResultListItem>
      ))}
    </SearchResultUnorderedList>
  );
};

export default WorksSearchResults;
