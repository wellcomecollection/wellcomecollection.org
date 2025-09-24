import * as prismic from '@prismicio/client';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import {
  transformedVimeoEmbed,
  transformedYoutubeEmbed,
} from '@weco/cardigan/stories/data/videos';
import VideoEmbed from '@weco/common/views/components/VideoEmbed';

type StoryProps = ComponentProps<typeof VideoEmbed> & {
  hasTranscript: boolean;
  hasCaption: boolean;
};

const meta: Meta<StoryProps> = {
  title: 'Components/VideoEmbed',
  component: VideoEmbed,
  args: {
    ...transformedYoutubeEmbed,
    hasFullSizePoster: true,
    hasTranscript: true,
    hasCaption: true,
  },
  argTypes: {
    embedUrl: { table: { disable: true } },
    transcript: { table: { disable: true } },
    caption: { table: { disable: true } },
    videoThumbnail: { table: { disable: true } },
    videoProvider: {
      name: 'Video provider',
      control: { type: 'radio' },
      options: ['YouTube', 'Vimeo'],
    },
    hasFullSizePoster: {
      if: { arg: 'videoProvider', eq: 'YouTube' },
      control: 'boolean',
      name: 'Use full size YouTube poster image',
    },
    hasTranscript: { control: 'boolean', name: 'Has transcript' },
    hasCaption: { control: 'boolean', name: 'Has caption' },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'VideoEmbed',
  render: args => {
    const finalArgs = {
      ...args,
      ...(args.videoProvider === 'YouTube'
        ? transformedYoutubeEmbed
        : transformedVimeoEmbed),
      transcript: args.hasTranscript
        ? args.transcript
        : ([] as prismic.RichTextField),
      caption: args.hasCaption ? args.caption : ([] as prismic.RichTextField),
    };
    return <VideoEmbed {...finalArgs} />;
  },
};
