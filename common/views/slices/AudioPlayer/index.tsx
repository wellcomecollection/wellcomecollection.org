import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import AudioPlayer from '@weco/content/components/AudioPlayer/AudioPlayer';
import { transformAudioPlayerSlice } from '@weco/content/services/prismic/transformers/body';

export type AudioPlayerSliceProps =
  SliceComponentProps<Content.AudioPlayerSlice>;

const AudioPlayerSlice = ({ slice }: AudioPlayerSliceProps): JSX.Element => {
  const props = transformAudioPlayerSlice(slice);
  return <AudioPlayer {...props.value} />;
};

export default AudioPlayerSlice;
