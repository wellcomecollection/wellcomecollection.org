import { SliceZone } from '@prismicio/react';
import styled from 'styled-components';

import { PortraitVideoListSlice } from '@weco/common/prismicio-types';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { gridSize12 } from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { components } from '@weco/common/views/slices';
import { ThemeCardsListSliceValue } from '@weco/content/services/prismic/transformers/body';
import { Slice } from '@weco/content/types/body';
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

const ExhibitionCollectionsContent = ({
  isTendernessAndRageExhibition,
  themeCardsListSlice,
  videos,
  aboutThisExhibitionContent,
}: {
  isTendernessAndRageExhibition: boolean;
  themeCardsListSlice?: Slice<'themeCardsList', ThemeCardsListSliceValue>;
  videos: PortraitVideoListSlice[];
  aboutThisExhibitionContent: AboutThisExhibitionContent[];
}) => {
  // For now, we only want to trial displaying stories here for the Tenderness and Rage exhibition.
  // If this trial is successful, we will want to expand this to other exhibitions in the future.
  const shouldDisplayStories =
    isTendernessAndRageExhibition && aboutThisExhibitionContent.length > 0;
  const shouldDisplayThemes = Boolean(
    themeCardsListSlice && themeCardsListSlice.value.conceptIds.length > 0
  );

  const { verticalVideos } = useToggles();

  const shouldDisplay =
    shouldDisplayStories ||
    shouldDisplayThemes ||
    (videos.length > 0 && verticalVideos);

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
              <h3 className={font('brand-bold', 1)}>Read related stories</h3>
            </Space>

            <Grid className="card-theme card-theme--transparent">
              {aboutThisExhibitionContent.map(item => (
                <GridCell key={item.id} $sizeMap={{ m: [6], l: [4], xl: [4] }}>
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
                </GridCell>
              ))}
            </Grid>
          </Space>
        )}
      </Container>

      {shouldDisplayThemes && themeCardsListSlice && (
        <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
          <ThemeCardsList
            conceptIds={themeCardsListSlice.value.conceptIds}
            gtmData={{
              'category-label': themeCardsListSlice.value.title,
              'category-position-in-list': undefined,
            }}
            sliceTitle={themeCardsListSlice.value.title}
            description={themeCardsListSlice.value.description}
            headingLevel={3}
            fontFamily="brand-bold"
            useShim
          />
        </Space>
      )}
      {verticalVideos && videos?.length > 0 && (
        <SliceZone
          slices={videos}
          components={components}
          context={{ gridSizes: gridSize12(), hasNoShim: false }}
        />
      )}
    </Wrapper>
  );
};

export default ExhibitionCollectionsContent;
