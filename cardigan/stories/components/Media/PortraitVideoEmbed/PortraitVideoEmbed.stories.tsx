import * as prismic from '@prismicio/client';
import { Meta, StoryObj } from '@storybook/react';

import { image } from '@weco/cardigan/stories/data/images';
import PortraitVideoEmbed from '@weco/common/views/components/PortraitVideoEmbed';

const sampleTranscript: prismic.RichTextField = [
  {
    type: 'paragraph',
    text: 'In the nineteenth century, cholera swept through cities across the world, killing thousands. But some people recovered. What allowed them to survive, and what can we learn from their stories today?',
    spans: [],
  },
  {
    type: 'paragraph',
    text: 'Historians and scientists are now piecing together the evidence — from patient records, to letters, to early clinical trials — to understand the biology of survival.',
    spans: [],
  },
];

const meta: Meta<typeof PortraitVideoEmbed> = {
  title: 'Components/Media/PortraitVideoEmbed',
  component: PortraitVideoEmbed,
  args: {
    embedUrl: 'https://www.youtube.com/embed/jS7I9286_Bg?feature=oembed',
    videoProvider: 'YouTube',
    posterImage: image(),
    duration: '1:23 mins',
    title: 'What can we learn from cholera recovery?',
    transcript: sampleTranscript,
  },
  argTypes: {
    embedUrl: { table: { disable: true } },
    transcript: { table: { disable: true } },
    posterImage: { table: { disable: true } },
    videoProvider: {
      name: 'Video provider',
      control: { type: 'radio' },
      options: ['YouTube', 'Vimeo'],
    },
    duration: {
      name: 'Duration',
      control: 'text',
    },
    title: {
      name: 'Title',
      control: 'text',
    },
  },
  decorators: [
    Story => (
      <div style={{ maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PortraitVideoEmbed>;

export const Basic: Story = {
  name: 'PortraitVideoEmbed',
};
