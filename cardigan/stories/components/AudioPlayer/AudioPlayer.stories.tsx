import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import Readme from '@weco/common/views/components/AudioPlayer/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const Template = args => (
  <ReadmeDecorator WrappedComponent={AudioPlayer} args={args} Readme={Readme} />
);
export const basic = Template.bind({});
basic.args = {
  audioFile:
    'https://iiif.wellcomecollection.org/av/b2248887x_0001.wav/full/max/default.mp3#identity',
  title: 'Mat Fraser: interview 1',
};
basic.storyName = 'AudioPlayer';
