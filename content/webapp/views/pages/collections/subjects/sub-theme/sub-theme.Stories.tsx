import { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  GridCellScroll,
  GridScroll,
} from '@weco/common/views/components/styled/Grid';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { fetchMultiContentClientSide } from '@weco/content/services/prismic/fetch/multi-content';
import { Article } from '@weco/content/types/articles';
import StoryCard from '@weco/content/views/components/StoryCard';

const StoryCardContainer = styled.div`
  -webkit-overflow-scrolling: touch;

  /* former .container--scroll */
  ${props =>
    props.theme.mediaBetween(
      'zero',
      'sm'
    )(`
    max-width: none;
    width: auto;
    overflow: auto;

    &::-webkit-scrollbar {
      height: 18px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 0;
      border-style: solid;
      border-width: 0 ${props.theme.containerPadding} 12px;
      background: ${props.theme.color('neutral.400')};
    }
  `)}

  &::-webkit-scrollbar {
    background: ${props => props.theme.color('warmNeutral.300')};
  }

  &::-webkit-scrollbar-thumb {
    border-color: ${props => props.theme.color('warmNeutral.300')};
  }
`;

const SubThemeStories = ({
  relatedStoriesId,
}: {
  relatedStoriesId: string[];
}) => {
  const [orderedStories, setOrderedStories] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const storyPromise = await fetchMultiContentClientSide(
        relatedStoriesId.map(id => `id:${id}`).join(' ')
      );

      if (storyPromise?.results) {
        setOrderedStories(
          relatedStoriesId
            .map(id => storyPromise.results.find(story => story.id === id))
            .filter(Boolean) as Article[]
        );
      }
      setIsLoading(false);
    };

    fetchStories();
  }, [relatedStoriesId]);

  if (isLoading)
    return (
      <div style={{ position: 'relative', height: '400px' }}>
        <LL />
      </div>
    );

  return (
    <StoryCardContainer>
      <Space $v={{ size: 'md', properties: ['padding-bottom'] }}>
        <GridScroll className="card-theme card-theme--transparent">
          {orderedStories.map(article => (
            <GridCellScroll
              key={article.id}
              $sizeMap={{ m: [6], l: [4], xl: [4] }}
            >
              <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
                <StoryCard variant="prismic" article={article} showAllLabels />
              </Space>
            </GridCellScroll>
          ))}
        </GridScroll>
      </Space>
    </StoryCardContainer>
  );
};

export default SubThemeStories;
