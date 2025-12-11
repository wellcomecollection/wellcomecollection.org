import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { EmbedSlice as RawEmbedSlice } from '@weco/common/prismicio-types';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import VideoEmbed from '@weco/common/views/components/VideoEmbed';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import SoundCloudEmbed from '@weco/content/views/components/SoundCloudEmbed';

export type EmbedProps = SliceComponentProps<RawEmbedSlice, SliceZoneContext>;

const EmbedSlice: FunctionComponent<EmbedProps> = ({ slice, context }) => {
  const transformedSlice = transformEmbedSlice(slice);
  const options = { ...defaultContext, ...context };

  return transformedSlice ? (
    <>
      {transformedSlice.type === 'videoEmbed' && (
        <SpacingComponent $sliceType={transformedSlice.type}>
          <ContaineredLayout
            gridSizes={options.isShortFilm ? gridSize12() : options.gridSizes}
          >
            <VideoEmbed
              {...transformedSlice.value}
              hasFullSizePoster={options.isShortFilm}
            />
          </ContaineredLayout>
        </SpacingComponent>
      )}
      {transformedSlice.type === 'soundcloudEmbed' && (
        <SpacingComponent $sliceType={transformedSlice.type}>
          <ContaineredLayout gridSizes={options.gridSizes}>
            <SoundCloudEmbed {...transformedSlice.value} id={slice.id} />
          </ContaineredLayout>
        </SpacingComponent>
      )}
    </>
  ) : null;
};

export default EmbedSlice;
