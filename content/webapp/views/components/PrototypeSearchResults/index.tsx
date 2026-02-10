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
})<ResultRowProps>`
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

  return (
    <>
      <HeaderStack data-component="prototype-search-results">
        <HeaderSpacer />
        {works.totalResults > 0 && (
          <ColumnHeader>Alternative 1 ({works.totalResults})</ColumnHeader>
        )}
        {works2 && works2.totalResults > 0 && (
          <ColumnHeader>Alternative 2 ({works2.totalResults})</ColumnHeader>
        )}
        {works3 && works3.totalResults > 0 && (
          <ColumnHeader>Alternative 3 ({works3.totalResults})</ColumnHeader>
        )}
      </HeaderStack>

      <ResultsGrid>
        {rows.map((_, i) => (
          <ResultRow key={i} $isAlternating={i % 2 === 1}>
            <RowNumber>{calculateResultPosition(i)}.</RowNumber>
            {works.totalResults > 0 && (
              <ResultCell>
                {works.results[i] && (
                  <WorksSearchResult
                    work={works.results[i]}
                    resultPosition={calculateResultPosition(i)}
                  />
                )}
              </ResultCell>
            )}
            {works2 && works2.totalResults > 0 && (
              <ResultCell>
                {/* TODO: When switching to getWorks, replace manual object construction with: work={works2.results[i]} */}
                {works2.results[i] && (
                  <WorksSearchResult
                    work={{
                      id: works2.results[i].id,
                      title: works2.results[i].label,
                      languageId: undefined,
                      thumbnail: undefined,
                      referenceNumber: undefined,
                      productionDates: [],
                      archiveLabels: undefined,
                      cardLabels: [{ text: 'Concept' }],
                      primaryContributorLabel: undefined,
                      notes: [],
                    }}
                    resultPosition={calculateResultPosition(i)}
                  />
                )}
              </ResultCell>
            )}
            {works3 && works3.totalResults > 0 && (
              <ResultCell>
                {/* TODO: When switching to getWorks, replace manual object construction with: work={works3.results[i]} */}
                {works3.results[i] && (
                  <WorksSearchResult
                    work={{
                      id: works3.results[i].id,
                      title: works3.results[i].source.title,
                      languageId: undefined,
                      thumbnail: works3.results[i].thumbnail,
                      referenceNumber: undefined,
                      productionDates: [],
                      archiveLabels: undefined,
                      cardLabels: [{ text: 'Image' }],
                      primaryContributorLabel: undefined,
                      notes: [],
                    }}
                    resultPosition={calculateResultPosition(i)}
                  />
                )}
              </ResultCell>
            )}
          </ResultRow>
        ))}
      </ResultsGrid>
    </>
  );
};

export default PrototypeSearchResults;
