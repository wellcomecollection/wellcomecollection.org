import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { EmbedSlice as RawEmbedSlice } from '@weco/common/prismicio-types';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
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

  if (!transformedSlice) return null;

  const gridSizes =
    transformedSlice.type === 'videoEmbed' && options.isShortFilm
      ? gridSize12()
      : options.gridSizes;

  if (transformedSlice.type === 'videoEmbed')
    return (
      <SpacingComponent $sliceType={transformedSlice.type}>
        <ConditionalWrapper
          condition={!!gridSizes}
          wrapper={children => (
            <ContaineredLayout gridSizes={gridSizes!}>
              {children}
            </ContaineredLayout>
          )}
        >
          <VideoEmbed
            {...transformedSlice.value}
            hasFullSizePoster={options.isShortFilm}
          />
        </ConditionalWrapper>
      </SpacingComponent>
    );

  if (transformedSlice.type === 'soundcloudEmbed')
    return (
      <SpacingComponent $sliceType={transformedSlice.type}>
        <ConditionalWrapper
          condition={!!options.gridSizes}
          wrapper={children => (
            <ContaineredLayout gridSizes={options.gridSizes!}>
              {children}
            </ContaineredLayout>
          )}
        >
          <SoundCloudEmbed {...transformedSlice.value} id={slice.id} />
        </ConditionalWrapper>
      </SpacingComponent>
    );
};

export default EmbedSlice;
