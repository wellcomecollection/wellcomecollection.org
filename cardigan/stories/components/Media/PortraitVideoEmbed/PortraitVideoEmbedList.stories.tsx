import * as prismic from '@prismicio/client';
import { Meta, StoryObj } from '@storybook/react';

import { image } from '@weco/cardigan/stories/data/images';
import PortraitVideoList from '@weco/content/views/components/PortraitVideoList';

const sampleTranscript: prismic.RichTextField = [
  {
    type: 'paragraph',
    text: 'In the nineteenth century, cholera swept through cities across the world, killing thousands. But some people recovered. What allowed them to survive, and what can we learn from their stories today?',
    spans: [],
  },
];

const items = [
  {
    embedUrl: 'https://www.youtube.com/embed/jS7I9286_Bg?feature=oembed',
    posterImage: image(),
    duration: '1:23 mins',
    title: 'What can we learn from cholera recovery?',
    transcript: sampleTranscript,
  },
  {
    embedUrl: 'https://www.youtube.com/embed/jS7I9286_Bg?feature=oembed',
    posterImage: image(),
    duration: '2:45 mins',
    title: 'The biology of survival',
  },
  {
    embedUrl: 'https://www.youtube.com/embed/jS7I9286_Bg?feature=oembed',
    posterImage: image(),
    duration: '3:10 mins',
    title: 'Patient records and early clinical trials',
  },
  {
    embedUrl: 'https://www.youtube.com/embed/jS7I9286_Bg?feature=oembed',
    posterImage: image(),
    duration: '1:55 mins',
    title: 'Letters from the epidemic',
  },
];

const meta: Meta<typeof PortraitVideoList> = {
  title: 'Components/Media/PortraitVideoEmbedList',
  component: PortraitVideoList,
  args: {
    title: 'Short films',
    items,
  },
  argTypes: {
    items: { table: { disable: true } },
    gridSizes: { table: { disable: true } },
  },
  parameters: {
    chromatic: {
      viewports: [375, 1200],
    },
  },
};

export default meta;

type Story = StoryObj<typeof PortraitVideoList>;

export const Basic: Story = {
  name: 'PortraitVideoEmbedList',
};
