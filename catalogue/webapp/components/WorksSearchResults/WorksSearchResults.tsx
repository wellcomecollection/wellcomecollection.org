import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { trackSearchResultSelected } from '@weco/common/views/components/Tracker/Tracker';
import WorksSearchResult from '../WorksSearchResult/WorksSearchResult';
import { CatalogueResultsList, Work } from '@weco/common/model/catalogue';
import { CatalogueWorksApiProps } from '@weco/common/services/catalogue/ts_api';

type Props = {
  works: CatalogueResultsList<Work>;
  apiProps: CatalogueWorksApiProps;
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
`;

const WorkSearchResults: FunctionComponent<Props> = ({
  works,
  apiProps,
}: Props) => {
  return (
    <SearchResultUnorderedList>
      {works.results.map((result, i) => (
        <SearchResultListItem key={result.id}>
          <div
            onClick={() => {
              trackSearchResultSelected(apiProps, {
                id: result.id,
                position: i,
                resultWorkType: result.workType.label,
                resultIdentifiers: result.identifiers.map(
                  identifier => identifier.value
                ),
                resultSubjects:
                  result.subjects?.map(subject => subject.label) || [],
                source: 'work_result',
              });
            }}
          >
            <WorksSearchResult work={result} resultPosition={i} />
          </div>
        </SearchResultListItem>
      ))}
    </SearchResultUnorderedList>
  );
};

export default WorkSearchResults;
