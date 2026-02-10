import { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { WellcomeResultList } from '@weco/content/services/wellcome';
import {
  CatalogueResultsList,
  Concept,
  Image,
  WorkAggregations,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import WorksSearchResult from '@weco/content/views/components/WorksSearchResults/WorksSearchResults.Result';

type Props = {
  works: WellcomeResultList<WorkBasic, WorkAggregations>;
  works2: CatalogueResultsList<Concept> | null | undefined; // TODO this is temorary until we switch to semantic search APIs, when this will become a different set of works results
  works3: CatalogueResultsList<Image> | null | undefined; // TODO this is temorary until we switch to semantic search APIs, when this will become a different set of works results
  currentPage: number;
};

const HeaderStack = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 32px;
  border-bottom: 2px solid ${props => props.theme.color('neutral.300')};
  ${props => props.theme.media('md', 'max-width')`
    flex-direction: column;
  `}
`;

const HeaderSpacer = styled.div`
  min-width: 40px;
  flex-shrink: 0;
  border-right: 1px dashed ${props => props.theme.color('neutral.300')};
`;

const ColumnHeader = styled.h3`
  flex-grow: 1;
  flex-basis: 1px;
`;

const ResultsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

type ResultRowProps = {
  $isAlternating?: boolean;
};

const ResultRow = styled.div<ResultRowProps>`
  display: flex;
  gap: 32px;
  align-items: stretch;
  background-color: ${props =>
    props.$isAlternating ? props.theme.color('neutral.300') : 'transparent'};

  &:last-child {
    border-bottom: none;
  }

  ${props => props.theme.media('md', 'max-width')`
    flex-direction: column;
  `}
`;

const RowNumber = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top'] },
})`
  font-size: 18px;
  font-weight: bold;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px dashed ${props => props.theme.color('neutral.300')};
  background-color: ${props => props.theme.color('white')};
  padding: 0;
`;

const ResultCell = styled.div`
  flex-grow: 1;
  flex-basis: 1px;
  min-width: 0;
`;

const PrototypeSearchResults: FunctionComponent<Props> = ({
  works,
  works2,
  works3,
  currentPage,
}) => {
  const calculateResultPosition = (index: number) =>
    (currentPage - 1) * 25 + (index + 1); // 25 is the pageSize

  const rows = useMemo(
    () =>
      Array.from({
        length: Math.max(
          works.results.length,
          works2?.results.length || 0,
          works3?.results.length || 0
        ),
      }),
    [works.results.length, works2?.results.length, works3?.results.length]
  );

  const renderResultCell = (
    data:
      | WellcomeResultList<WorkBasic, WorkAggregations>
      | CatalogueResultsList<Concept>
      | CatalogueResultsList<Image>
      | null
      | undefined,
    index: number,
    isWorkBasic: boolean = true
  ) => {
    // Always render the cell to maintain column structure
    if (!data || !data.results[index]) {
      return <ResultCell />;
    }

    return (
      <ResultCell>
        {isWorkBasic ? (
          <WorksSearchResult
            work={data.results[index] as WorkBasic}
            resultPosition={calculateResultPosition(index)}
          />
        ) : (
          // TODO: When switching to getWorks, replace manual object construction with: work={data.results[index]}
          <WorksSearchResult
            work={{
              id: (data.results[index] as Concept | Image).id,
              title:
                (data.results[index] as Concept).label ||
                (data.results[index] as Image).source.title,
              languageId: undefined,
              thumbnail: (data.results[index] as Image).thumbnail,
              referenceNumber: undefined,
              productionDates: [],
              archiveLabels: undefined,
              cardLabels: [
                {
                  text: (data.results[index] as Concept).label
                    ? 'Concept'
                    : 'Image',
                },
              ],
              primaryContributorLabel: undefined,
              notes: [],
            }}
            resultPosition={calculateResultPosition(index)}
          />
        )}
      </ResultCell>
    );
  };

  return (
    <>
      <HeaderStack data-component="prototype-search-results">
        <HeaderSpacer />
        {works && (
          <ColumnHeader>Alternative 1 ({works.totalResults})</ColumnHeader>
        )}
        {works2 && (
          <ColumnHeader>Alternative 2 ({works2.totalResults})</ColumnHeader>
        )}
        {works3 && (
          <ColumnHeader>Alternative 3 ({works3.totalResults})</ColumnHeader>
        )}
      </HeaderStack>

      <ResultsGrid>
        {rows.map((_, i) => (
          <ResultRow key={i} $isAlternating={i % 2 === 1}>
            <RowNumber>{calculateResultPosition(i)}.</RowNumber>
            {renderResultCell(works, i, true)}
            {renderResultCell(works2, i, false)}
            {renderResultCell(works3, i, false)}
          </ResultRow>
        ))}
      </ResultsGrid>
    </>
  );
};

export default PrototypeSearchResults;
