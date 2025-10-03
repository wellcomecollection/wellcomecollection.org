import type { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { prismicRichTextMultiline } from '@weco/cardigan/stories/data/text';
import AudioPlayer from '@weco/content/views/components/AudioPlayer';
import Readme from '@weco/content/views/components/AudioPlayer/README.mdx';

type StoryProps = ComponentProps<typeof AudioPlayer> & {
  hasTranscript: boolean;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Media/AudioPlayer',
  component: AudioPlayer,
  args: {
    audioFile:
      'https://iiif.wellcomecollection.org/av/b2248887x_0001.wav/full/max/default.mp3#identity',
    title: 'Mat Fraser: interview 1',
    isDark: true,
    transcript: prismicRichTextMultiline,
    hasTranscript: true,
  },
  argTypes: {
    audioFile: { control: 'text', name: 'Audio file URL' },
    isDark: { control: 'boolean', name: 'Dark theme' },
    hasTranscript: { control: 'boolean', name: 'Has transcript' },
    title: { control: 'text', name: 'Title' },
    titleProps: { table: { disable: true } },
    transcript: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'AudioPlayer',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={args => {
        const { hasTranscript, ...rest } = args;
        return (
          <div
            style={{
              padding: '20px',
              background: args.isDark ? '#111' : 'white',
            }}
          >
            <AudioPlayer
              {...rest}
              transcript={hasTranscript ? args.transcript : []}
            />
          </div>
        );
      }}
      args={args}
      Readme={Readme}
    />
  ),
};
