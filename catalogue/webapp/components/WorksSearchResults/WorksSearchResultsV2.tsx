import { FC } from 'react';
import styled from 'styled-components';
import WorksSearchResultV2 from '../WorksSearchResult/WorksSearchResultV2';
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';

type Props = {
  works: CatalogueResultsList<Work>;
};

const SearchResultListItem = styled.li`
  flex-basis: 100%;
  max-width: 100%;
  border-top: 1px solid ${props => props.theme.newColor('neutral.300')};

  &:first-child {
    border-top: 0;

    & > a {
      padding-top: 0;
    }
  }
`;

const WorkSearchResultsV2: FC<Props> = ({ works }: Props) => {
  return (
    <ul className="plain-list flex flex--wrap no-margin no-padding">
      {works.results.map((result, i) => (
        <SearchResultListItem key={result.id}>
          <WorksSearchResultV2 work={result} resultPosition={i} />
        </SearchResultListItem>
      ))}
    </ul>
  );
};

export default WorkSearchResultsV2;
