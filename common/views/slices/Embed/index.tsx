import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { EmbedSlice as RawEmbedSlice } from '@weco/common/prismicio-types';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/common/views/components/Body';
import SoundCloudEmbed from '@weco/common/views/components/SoundCloudEmbed';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import VideoEmbed from '@weco/common/views/components/VideoEmbed';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';

export type EmbedProps = SliceComponentProps<RawEmbedSlice, SliceZoneContext>;

const EmbedSlice: FunctionComponent<EmbedProps> = ({ slice, context }) => {
  const transformedSlice = transformEmbedSlice(slice);
  const options = { ...defaultContext, ...context };

  return transformedSlice ? (
    <>
      {transformedSlice.type === 'videoEmbed' && (
        <SpacingComponent $sliceType={transformedSlice.type}>
          <LayoutWidth width={options.isShortFilm ? 12 : options.minWidth}>
            <VideoEmbed
              {...transformedSlice.value}
              hasFullSizePoster={options.isShortFilm}
            />
          </LayoutWidth>
        </SpacingComponent>
      )}
      {transformedSlice.type === 'soundcloudEmbed' && (
        <SpacingComponent $sliceType={transformedSlice.type}>
          <LayoutWidth width={options.minWidth}>
            <SoundCloudEmbed {...transformedSlice.value} id={slice.id} />
          </LayoutWidth>
        </SpacingComponent>
      )}
    </>
  ) : null;
};

export default EmbedSlice;
