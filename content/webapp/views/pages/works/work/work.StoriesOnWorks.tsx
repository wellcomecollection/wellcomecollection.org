import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { useAbortSignalEffect } from '@weco/common/hooks/useAbortSignalEffect';
import { Container } from '@weco/common/views/components/styled/Container';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { Article } from '@weco/content/services/wellcome/content/types/api';
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

type Props = {
  workId: string;
};

const WorkStoriesOnWorks: FunctionComponent<Props> = ({ workId }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useAbortSignalEffect(
    signal => {
      const fetchRelatedContent = async () => {
        if (!workId) return;

        setIsLoading(true);

        try {
          const url = `/api/content/stories-by-work?workId=${workId}`;
          const response = await fetch(url, { signal });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (!signal.aborted) {
            const articleResults = data.results || [];

            setArticles(articleResults);
            setIsLoading(false);
          }
        } catch (err) {
          if (!signal.aborted) {
            setIsLoading(false);
          }
        }
      };

      fetchRelatedContent();
    },
    [workId]
  );

  if (!isLoading && articles.length === 0) return null;

  if (isLoading) {
    return (
      <SectionWrapper>
        <Container>
          <Space $v={{ size: 'm', properties: ['padding-top'] }}>
            <LoadingWrapper>
              <LL />
            </LoadingWrapper>
          </Space>
        </Container>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <Container>
        <Space $v={{ size: 'l', properties: ['padding-top'] }}>
          <h2>Stories featuring this work</h2>
        </Space>

        <Space $v={{ size: 'm', properties: ['padding-top'] }}>
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
        </Space>
      </Container>
    </SectionWrapper>
  );
};

export default WorkStoriesOnWorks;
