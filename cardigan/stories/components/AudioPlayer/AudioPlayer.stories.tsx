import type { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { prismicRichTextMultiline } from '@weco/cardigan/stories/data/text';
import AudioPlayer from '@weco/common/views/components/AudioPlayer';
import Readme from '@weco/common/views/components/AudioPlayer/README.mdx';

const meta: Meta<typeof AudioPlayer> = {
  title: 'Components/AudioPlayer',
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
  name: 'AudioPlayer',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={args => (
        <div
          style={{
            padding: '20px',
            background: args.isDark ? '#111' : 'white',
          }}
        >
          <AudioPlayer {...args} />
        </div>
      )}
      args={args}
      Readme={Readme}
    />
  ),
};
