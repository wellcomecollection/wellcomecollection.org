import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import styled from 'styled-components';

import { ExhibitionsDocumentDataOnwardJourneysSlice } from '@weco/common/prismicio-types';
import { useFeatureFlags } from '@weco/common/server-data/Context';
import { gridSize12 } from '@weco/common/views/components/Layout';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { components } from '@weco/common/views/slices';
import SectionHeader from '@weco/content/views/components/SectionHeader';

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
  onwardJourneys,
}: {
  onwardJourneys: prismic.SliceZone<ExhibitionsDocumentDataOnwardJourneysSlice>;
}) => {
  const { verticalVideos } = useFeatureFlags();

  const shouldDisplayCardListings = onwardJourneys.some(
    (slice: prismic.Slice) =>
      slice.slice_type === 'cardListing' &&
      Array.isArray(slice.items) &&
      slice.items.length > 0
  );

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
    shouldDisplayCardListings || shouldDisplayThemes || shouldDisplayVideos;

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
      </Container>

      <SliceZone
        // filter out videos if verticalVideos is false
        slices={onwardJourneys.filter(
          (slice: prismic.Slice) =>
            verticalVideos || slice.slice_type !== 'portraitVideoList'
        )}
        components={components}
        context={{
          gridSizes: gridSize12(),
          hasNoShim: false,
          itemsHaveTransparentBackground: true,
        }}
      />
    </Wrapper>
  );
};

export default ExhibitionCollectionsContent;
