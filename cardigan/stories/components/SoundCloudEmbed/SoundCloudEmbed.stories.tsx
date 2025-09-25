import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { transformedSoundCloudEmbed } from '@weco/cardigan/stories/data/media';
import SoundCloudEmbed from '@weco/content/views/components/SoundCloudEmbed';

type StoryProps = ComponentProps<typeof SoundCloudEmbed> & {
  hasCaption: boolean;
  hasTranscript: boolean;
};

const meta: Meta<StoryProps> = {
  title: 'Components/SoundCloudEmbed',
  component: SoundCloudEmbed,
  args: {
    ...transformedSoundCloudEmbed,
    hasCaption: false,
    hasTranscript: false,
  },
  argTypes: {
    id: { table: { disable: true } },
    embedUrl: { table: { disable: true } },
    caption: { table: { disable: true } },
    transcript: { table: { disable: true } },
    hasCaption: {
      control: 'boolean',
      name: 'With caption',
    },
    hasTranscript: {
      control: 'boolean',
      name: 'With transcript',
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'SoundCloudEmbed',
  render: args => {
    const { hasCaption, hasTranscript, ...rest } = args;

    return (
      <SoundCloudEmbed
        {...rest}
        caption={
          hasCaption
            ? [{ type: 'paragraph', text: 'This is a caption', spans: [] }]
            : []
        }
        transcript={
          hasTranscript
            ? [
                {
                  type: 'paragraph',
                  text: 'This is a transcript. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                  spans: [],
                },
              ]
            : []
        }
      />
    );
  },
};
