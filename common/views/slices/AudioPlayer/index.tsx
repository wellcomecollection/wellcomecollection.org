// import { Content } from '@prismicio/client';
import { AudioPlayerSlice as SliceType } from '../../../prismicio-types';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '../../components/styled/SpacingComponent';
import {
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';
import { transformAudioPlayerSlice } from '@weco/content/services/prismic/transformers/body';
import AudioPlayer from '@weco/content/components/AudioPlayer/AudioPlayer';

export type AudioPlayerProps = SliceComponentProps<SliceType, SliceZoneContext>;

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
