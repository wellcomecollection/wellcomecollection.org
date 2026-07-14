import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import styled from 'styled-components';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import { ExhibitionsDocumentDataOnwardJourneysSlice } from '@weco/common/prismicio-types';
import { useFeatureFlags } from '@weco/common/server-data/Context';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { components } from '@weco/common/views/slices';
import MoreLink from '@weco/content/views/components/MoreLink';

export const Wrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  as: 'section',
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

const ExhibitionCollectionsContent = ({
  exhibitionUid,
  onwardJourneys,
  isTendernessAndRageExhibition,
}: {
  exhibitionUid: string;
  onwardJourneys: prismic.SliceZone<ExhibitionsDocumentDataOnwardJourneysSlice>;
  isTendernessAndRageExhibition: boolean;
}) => {
  const { isTendernessAndRageKiosk } = useKiosk();
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

      {isTendernessAndRageExhibition && isTendernessAndRageKiosk && (
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space
            $v={{
              size: 'xl',
              properties: ['padding-top'],
            }}
          >
            <MoreLink
              colors={{
                border: 'accent.green',
                background: 'transparent',
                text: 'accent.green',
              }}
              url={`/exhibitions/${exhibitionUid}/explore-more`}
              name="Explore more"
            />
          </Space>
        </ContaineredLayout>
      )}
    </Wrapper>
  );
};

export default ExhibitionCollectionsContent;
