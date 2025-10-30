import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { useWorkRelatedContent } from '@weco/content/hooks/useWorkRelatedContent';
import {
  Addressable,
  Article,
} from '@weco/content/services/wellcome/content/types/api';
import StoryCard from '@weco/content/views/components/StoryCard';
import StoriesGrid from '@weco/content/views/pages/search/stories/stories.Grid';

const LoadingWrapper = styled.div`
  position: relative;
  min-height: 200px;
`;

const SectionWrapper = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const ErrorMessage = styled.p.attrs({
  className: font('intr', 5),
})`
  color: ${props => props.theme.color('validation.red')};
  margin: 0;
`;

const InfoMessage = styled.p.attrs({
  className: font('intr', 5),
})`
  margin: 0;
`;

const BasicCard = styled.div`
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
`;

const CardTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: bold;
`;

const CardDescription = styled.p`
  margin: 0 0 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const CardMeta = styled.div`
  font-size: 12px;
  color: #888;
`;

type Props = {
  workId: string;
};

const WorkStoriesOnWorks: FunctionComponent<Props> = ({ workId }) => {
  const { relatedContent, articles, totalResults, state, error } =
    useWorkRelatedContent(workId);

  // Debug logging
  console.log('WorkStoriesOnWorks:', {
    workId,
    state,
    totalResults,
    error,
    relatedContent,
    articles,
  });

  if (state === 'loading') {
    return (
      <SectionWrapper>
        <Container>
          <Space $v={{ size: 'l', properties: ['padding-top'] }}>
            <h2>Related content</h2>
            <LoadingWrapper>
              <LL />
            </LoadingWrapper>
          </Space>
        </Container>
      </SectionWrapper>
    );
  }

  if (state === 'error' || error) {
    return (
      <SectionWrapper>
        <Container>
          <Space $v={{ size: 'l', properties: ['padding-top'] }}>
            <h2>Stories mentioning this work</h2>
            <ErrorMessage>Failed to load related content: {error}</ErrorMessage>
          </Space>
        </Container>
      </SectionWrapper>
    );
  }

  if (state === 'success' && relatedContent.length === 0 && articles.length === 0) {
    return (
      <SectionWrapper>
        <Container>
          <Space $v={{ size: 'l', properties: ['padding-top'] }}>
            <h2>Stories mentioning this work</h2>
            <InfoMessage>No content references this work.</InfoMessage>
          </Space>
        </Container>
      </SectionWrapper>
    );
  }

  const renderContentCard = (item: Addressable) => {
    // Handle different content types from the Content API
    if (item.type === 'Article') {
      return (
        <StoryCard
          key={item.id}
          variant="contentApi"
          article={item as unknown as Article}
        />
      );
    }

    // For other content types, create a basic card layout
    return (
      <BasicCard key={item.id}>
        <CardTitle>{item.title}</CardTitle>
        {item.description && (
          <CardDescription>{item.description}</CardDescription>
        )}
        <CardMeta>
          <span>{item.type}</span>
          {item.format && <span> • {item.format}</span>}
        </CardMeta>
      </BasicCard>
    );
  };

  return (
    <SectionWrapper>
      <Container>
        <Space $v={{ size: 'l', properties: ['padding-top'] }}>
          <h2>Related content</h2>
          <InfoMessage>
            {totalResults} item{totalResults !== 1 ? 's' : ''} reference
            {totalResults === 1 ? 's' : ''} this work
          </InfoMessage>
        </Space>

        <Space $v={{ size: 'm', properties: ['padding-top'] }}>
          {/* Render articles using StoriesGrid component */}
          {articles.length > 0 && (
            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              <StoriesGrid
                articles={articles}
                dynamicImageSizes={{
                  small: 100,
                  medium: 50,
                  large: 25,
                  xlarge: 25,
                }}
              />
            </Space>
          )}

          {/* Render other content types in grid format */}
          {relatedContent.length > 0 && (
            <Grid>
              {relatedContent.map(item => (
                <GridCell
                  key={item.id}
                  $sizeMap={{ s: [12], m: [6], l: [4], xl: [4] }}
                >
                  {renderContentCard(item)}
                </GridCell>
              ))}
            </Grid>
          )}
        </Space>
      </Container>
    </SectionWrapper>
  );
};

export default WorkStoriesOnWorks;
