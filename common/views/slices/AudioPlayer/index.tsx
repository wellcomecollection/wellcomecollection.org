import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import AudioPlayer, {
  AudioPlayerProps,
} from '@weco/content/components/AudioPlayer/AudioPlayer';

export type AudioPlayerSliceProps = SliceComponentProps<{
  type: 'audioPlayer';
  value: AudioPlayerProps;
}>;

const AudioPlayerSlice: FunctionComponent<AudioPlayerSliceProps> = ({
  slice,
}): JSX.Element => {
  return <AudioPlayer {...slice.value} />;
};

export default AudioPlayerSlice;
