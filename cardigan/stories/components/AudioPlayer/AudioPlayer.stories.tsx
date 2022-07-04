import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';

const Template = args => <AudioPlayer {...args} />;
export const basic = Template.bind({});
basic.args = {
  audioFile:
    'https://iiif.wellcomecollection.org/av/b2248887x_0001.wav/full/max/default.mp3#identity',
  title: 'Mat Fraser: interview 1',
};
basic.storyName = 'AudioPlayer';
