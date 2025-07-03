import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { AudioPlayerSlice as RawAudioPlayerSlice } from '@weco/common/prismicio-types';
import AudioPlayer from '@weco/common/views/components/AudioPlayer';
import {
  LayoutWidth,
  SliceZoneContext,
} from '@weco/common/views/components/Body';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformAudioPlayerSlice } from '@weco/content/services/prismic/transformers/body';

export type AudioPlayerProps = SliceComponentProps<
  RawAudioPlayerSlice,
  SliceZoneContext
>;

const AudioPlayerSlice: FunctionComponent<AudioPlayerProps> = ({
  slice,
  context,
}) => {
  const transformedSlice = transformAudioPlayerSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <LayoutWidth width={context.minWidth}>
        <AudioPlayer {...transformedSlice.value} />
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default AudioPlayerSlice;
