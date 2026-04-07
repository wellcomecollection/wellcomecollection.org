import styled from 'styled-components';

import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { font } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import {
  GridCellScroll,
  GridScroll,
} from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { transformThemeCardsList } from '@weco/content/services/prismic/transformers/body';
import { convertItemToCardProps } from '@weco/content/types/card';
import { AboutThisExhibitionContent } from '@weco/content/types/exhibitions';
import Card from '@weco/content/views/components/Card';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import StoryCard from '@weco/content/views/components/StoryCard';
import ThemeCardsList from '@weco/content/views/components/ThemeCardsList';

export const Wrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  as: 'section',
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

// Stole this from sub-theme.Stories.tsx
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

const ExhibitionCollectionsContent = ({
  isTendernessAndRageExhibition,
  rawThemeCardsListSlice,
  videos,
  aboutThisExhibitionContent,
}: {
  isTendernessAndRageExhibition: boolean;
  rawThemeCardsListSlice?: RawThemeCardsListSlice;
  videos: string[];
  aboutThisExhibitionContent: AboutThisExhibitionContent[];
}) => {
  // Transform the slice here, similar to thematic browsing approach
  const themeCardsListSlice = rawThemeCardsListSlice
    ? transformThemeCardsList(rawThemeCardsListSlice)
    : undefined;
  // For now, we only want to trial displaying stories here for the Tenderness and Rage exhibition.
  // If this trial is successful, we will want to expand this to other exhibitions in the future.
  const shouldDisplayStories =
    isTendernessAndRageExhibition && aboutThisExhibitionContent.length > 0;
  const shouldDisplayThemes = Boolean(
    themeCardsListSlice && themeCardsListSlice.value.conceptIds.length > 0
  );

  const shouldDisplay =
    shouldDisplayStories || shouldDisplayThemes || videos.length > 0;

  if (!shouldDisplay) return null;

  return (
    <Wrapper>
      <Container>
        <SectionHeader title="Further reading" />
        <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
          <p>
            Explore the subjects and stories inspired by the topics in the
            exhibition
          </p>
        </Space>

        {shouldDisplayStories && (
          <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
            <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
              <h2 className={font('sans-bold', 2)}>Read related stories</h2>
            </Space>

            <StoryCardContainer>
              <GridScroll className="card-theme card-theme--transparent">
                {aboutThisExhibitionContent.map(item => (
                  <GridCellScroll
                    key={item.id}
                    $sizeMap={{ m: [6], l: [4], xl: [4] }}
                  >
                    <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
                      {item.type === 'articles' && (
                        <StoryCard
                          variant="prismic"
                          article={item}
                          showAllLabels
                        />
                      )}
                      {item.type === 'series' && (
                        <Card item={convertItemToCardProps(item)} />
                      )}
                    </Space>
                  </GridCellScroll>
                ))}
              </GridScroll>
            </StoryCardContainer>
          </Space>
        )}
      </Container>

      {shouldDisplayThemes && themeCardsListSlice && (
        <ThemeCardsList
          conceptIds={themeCardsListSlice.value.conceptIds}
          gtmData={{
            'category-label': themeCardsListSlice.value.title,
            'category-position-in-list': undefined,
          }}
          sliceTitle={themeCardsListSlice.value.title}
          description={themeCardsListSlice.value.description}
          useShim
        />
      )}

      {videos.length > 0 && (
        <Container>
          <p>Videos section</p>
        </Container>
      )}
    </Wrapper>
  );
};

export default ExhibitionCollectionsContent;
