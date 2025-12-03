import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Divider from '@weco/common/views/components/Divider';
import { Container } from '@weco/common/views/components/styled/Container';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { getArticles } from '@weco/content/services/wellcome/content/articles';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import StoriesGrid from '@weco/content/views/components/StoriesGrid';
import { Toggles } from '@weco/toggles';

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
  showDivider?: boolean;
  toggles: Toggles;
};

const WorkStoriesOnWorks: FunctionComponent<Props> = ({
  workId,
  showDivider,
  toggles,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRelatedContent = async () => {
      if (!workId) return;

      try {
        const response = await getArticles({
          params: { linkedWork: workId },
          pageSize: 4,
          toggles,
        });

        if (response?.type === 'Error') {
          setIsLoading(false);
          console.error('Error fetching articles:', response);
          return;
        }

        setArticles(response.results);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching articles:', error);
      }
    };

    if (articles.length === 0) {
      fetchRelatedContent();
    }
  }, [workId, toggles]);

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
          <h2 className={font('brand', 1)}>Stories featuring this work</h2>
        </Space>

        <Space $v={{ size: 'm', properties: ['padding-top'] }}>
          <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
            <StoriesGrid articles={articles} isCompact />
          </Space>
        </Space>

        {showDivider && <Divider lineColor="neutral.400" />}
      </Container>
    </SectionWrapper>
  );
};

export default WorkStoriesOnWorks;
