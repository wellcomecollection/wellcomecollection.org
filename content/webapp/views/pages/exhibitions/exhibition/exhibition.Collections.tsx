import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import styled from 'styled-components';

import { ExhibitionsDocumentDataOnwardJourneysSlice } from '@weco/common/prismicio-types';
import { useFeatureFlags } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { gridSize12 } from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { components } from '@weco/common/views/slices';
import { convertItemToCardProps } from '@weco/content/types/card';
import { AboutThisExhibitionContent } from '@weco/content/types/exhibitions';
import Card from '@weco/content/views/components/Card';
import SectionHeader from '@weco/content/views/components/SectionHeader';
import StoryCard from '@weco/content/views/components/StoryCard';

export const Wrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  as: 'section',
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

const SectionHeaderWrapper = styled.div`
  margin-bottom: ${props => props.theme.spacingUnits['100']};
`;

const ExhibitionCollectionsContent = ({
  isTendernessAndRageExhibition,
  onwardJourneys,
  aboutThisExhibitionContent,
}: {
  isTendernessAndRageExhibition: boolean;
  onwardJourneys: prismic.SliceZone<ExhibitionsDocumentDataOnwardJourneysSlice>;
  aboutThisExhibitionContent: AboutThisExhibitionContent[];
}) => {
  const { verticalVideos } = useFeatureFlags();

  // For now, we only want to trial displaying stories here for the Tenderness and Rage exhibition.
  // If this trial is successful, we will want to expand this to other exhibitions in the future.
  const shouldDisplayStories =
    isTendernessAndRageExhibition && aboutThisExhibitionContent.length > 0;

  const shouldDisplayThemes = onwardJourneys.some(
    (slice: prismic.Slice) =>
      slice.slice_type === 'themeCardsList' &&
      Array.isArray(slice.primary.concepts_list) &&
      slice.primary.concepts_list.length > 0
  );

  const shouldDisplayVideos =
    verticalVideos &&
    onwardJourneys.some(
      (slice: prismic.Slice) =>
        slice.slice_type === 'portraitVideoList' &&
        Array.isArray(slice.items) &&
        slice.items.length > 0
    );

  const shouldDisplay =
    shouldDisplayStories || shouldDisplayThemes || shouldDisplayVideos;

  if (!shouldDisplay) return null;

  return (
    <Wrapper>
      <Container>
        <SectionHeaderWrapper>
          <SectionHeader title="Further reading" />
        </SectionHeaderWrapper>
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
              {aboutThisExhibitionContent.map((item, index) => (
                <GridCell key={item.id} $sizeMap={{ m: [6], l: [4], xl: [4] }}>
                  <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
                    {item.type === 'articles' && (
                      <StoryCard
                        variant="prismic"
                        article={item}
                        showAllLabels
                        positionInList={index + 1}
                      />
                    )}
                    {item.type === 'series' && (
                      <Card
                        item={convertItemToCardProps(item)}
                        positionInList={index + 1}
                      />
                    )}
                  </Space>
                </GridCell>
              ))}
            </Grid>
          </Space>
        )}
      </Container>

      {shouldDisplayThemes && (
        <SliceZone
          // filter out videos if verticalVideos is false
          slices={onwardJourneys.filter(
            (slice: prismic.Slice) =>
              verticalVideos ||
              slice.slice_type !== 'portraitVideoList' ||
              !Array.isArray(slice.items) ||
              slice.items.length === 0
          )}
          components={components}
          context={{ gridSizes: gridSize12(), hasNoShim: false }}
        />
      )}
    </Wrapper>
  );
};

export default ExhibitionCollectionsContent;
