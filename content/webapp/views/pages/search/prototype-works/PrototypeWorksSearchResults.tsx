import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import LabelsList from '@weco/common/views/components/LabelsList';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import {
  Container,
  Details,
  Preview,
  PreviewImage,
  WorkInformation,
  WorkInformationItemSeparator,
  WorkTitleHeading,
  Wrapper,
} from '@weco/content/views/components/WorksSearchResults/WorksSearchResults.styles';
import WorkTitle from '@weco/content/views/components/WorkTitle';

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

// Custom component for prototype - links to production site
const PrototypeWorkSearchResult: FunctionComponent<{
  work: WorkBasic;
  resultPosition: number;
}> = ({ work, resultPosition }) => {
  const {
    productionDates,
    archiveLabels,
    cardLabels,
    primaryContributorLabel,
  } = work;

  // Link to production site instead of Next.js routing
  const productionUrl = `https://wellcomecollection.org/works/${work.id}`;

  return (
    <a
      href={productionUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'inline-block' }}
    >
      <Wrapper
        data-gtm-trigger="works_search_result"
        data-gtm-position-in-list={resultPosition + 1}
      >
        <Container>
          {work.thumbnail && (
            <Preview>
              <PreviewImage
                alt=""
                src={convertIiifImageUri(work.thumbnail.url, 120)}
              />
            </Preview>
          )}
          <Details>
            {cardLabels.length > 0 && (
              <Space $v={{ size: 'xs', properties: ['margin-bottom'] }}>
                <LabelsList
                  labels={cardLabels}
                  defaultLabelColor="warmNeutral.300"
                />
              </Space>
            )}
            <WorkTitleHeading>
              <WorkTitle title={work.title} />
            </WorkTitleHeading>

            <WorkInformation>
              {primaryContributorLabel && (
                <span className="searchable-selector">
                  {primaryContributorLabel}
                </span>
              )}

              {productionDates.length > 0 && (
                <>
                  <WorkInformationItemSeparator aria-hidden>
                    {' | '}
                  </WorkInformationItemSeparator>
                  <span className="searchable-selector">
                    Date:&nbsp;{productionDates[0]}
                  </span>
                </>
              )}

              {archiveLabels?.reference && (
                <>
                  <WorkInformationItemSeparator aria-hidden>
                    {' | '}
                  </WorkInformationItemSeparator>
                  <span>Reference:&nbsp;{archiveLabels?.reference}</span>
                </>
              )}
            </WorkInformation>
            {archiveLabels?.partOf && (
              <WorkInformation>
                Part of:&nbsp;{archiveLabels?.partOf}
              </WorkInformation>
            )}
          </Details>
        </Container>
      </Wrapper>
    </a>
  );
};

const PrototypeWorksSearchResults: FunctionComponent<Props> = ({ works }) => {
  return (
    <SearchResultUnorderedList data-component="works-search-results">
      {works.map((result, i) => (
        <SearchResultListItem data-testid="work-search-result" key={result.id}>
          <PrototypeWorkSearchResult work={result} resultPosition={i} />
        </SearchResultListItem>
      ))}
    </SearchResultUnorderedList>
  );
};

export default PrototypeWorksSearchResults;
