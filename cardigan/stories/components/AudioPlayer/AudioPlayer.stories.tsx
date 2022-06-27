import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';

const Template = args => <AudioPlayer {...args} />;
export const basic = Template.bind({});
basic.args = {
  audioFile:
    'https://wellcome-dot-org-audio.s3.eu-west-1.amazonaws.com/7130---.351a0eac-dd0f-4d97-ae52-eefbfdb96911.mp3',
  title: 'What is the link between climate change and infectious disease?',
};
basic.storyName = 'AudioPlayer';
