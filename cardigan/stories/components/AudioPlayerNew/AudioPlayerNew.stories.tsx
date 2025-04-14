import type { Meta, StoryObj } from '@storybook/react';

import { prismicRichTextMultiline } from '@weco/cardigan/stories/data/text';
import AudioPlayer from '@weco/content/components/AudioPlayerNew/AudioPlayer';

const meta: Meta<typeof AudioPlayer> = {
  title: 'Components/AudioPlayerNew',
  component: AudioPlayer,
  args: {
    audioFile:
      'https://iiif.wellcomecollection.org/av/b2248887x_0001.wav/full/max/default.mp3#identity',
    title: 'Mat Fraser: interview 1',
    isDark: true,
    transcript: prismicRichTextMultiline,
  },
  argTypes: {
    titleProps: {
      table: {
        disable: true,
      },
    },
    transcript: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AudioPlayer>;

export const Basic: Story = {
  name: 'AudioPlayerNew',
  render: args => <AudioPlayer {...args} />,
};
