import styled from 'styled-components';

import {
  GridCellScroll,
  GridScroll,
} from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
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

const SubThemeStories = ({ relatedStories }: { relatedStories: Article[] }) => {
  // TODO this uses Content List, which doesn't return labels or Part of
  // Figure out what solution we'd like to go with...
  return (
    <StoryCardContainer>
      <Space $v={{ size: 'md', properties: ['padding-bottom'] }}>
        <GridScroll className="card-theme card-theme--transparent">
          {relatedStories.map(article => (
            <GridCellScroll
              key={article.id}
              $sizeMap={{ m: [6], l: [4], xl: [4] }}
            >
              <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
                <StoryCard variant="prismic" article={article} />
              </Space>
            </GridCellScroll>
          ))}
        </GridScroll>
      </Space>
    </StoryCardContainer>
  );
};

export default SubThemeStories;
