import type { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import AudioPlayer from '@weco/content/components/AudioPlayerNew/AudioPlayer';
import Readme from '@weco/content/components/AudioPlayerNew/README.mdx';

const meta: Meta<typeof AudioPlayer> = {
  title: 'Components/AudioPlayerNew',
  component: AudioPlayer,
  args: {
    audioFile:
      'https://iiif.wellcomecollection.org/av/b2248887x_0001.wav/full/max/default.mp3#identity',
    title: 'Mat Fraser: interview 1',
    isDark: true,
  },
};

export default meta;

type Story = StoryObj<typeof AudioPlayer>;

export const Basic: Story = {
  name: 'AudioPlayerNew',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={AudioPlayer}
      args={args}
      Readme={Readme}
    />
  ),
};
