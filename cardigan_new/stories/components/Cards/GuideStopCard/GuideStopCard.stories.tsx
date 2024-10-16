import { Meta, StoryObj } from '@storybook/react';

import { imageWithCrops } from '@weco/cardigan_new/stories/data/images';
import GuideStopCard from '@weco/content/components/GuideStopCard';

const meta: Meta<typeof GuideStopCard> = {
  title: 'Components/Cards/GuideStopCard',
  component: GuideStopCard,
  args: {
    link: '/stop-1',
    totalStops: 3,
    duration: '03:30',
    number: 1,
    title: 'Exhibition guide stop',
    type: 'audio',
    image: imageWithCrops,
  },
  argTypes: {
    type: {
      options: ['audio', 'video'],
      control: { type: 'radio' },
    },
    link: {
      table: {
        disable: true,
      },
    },
    image: {
      control: 'radio',
      options: ['content image', 'placeholder image'],
      mapping: {
        'content image': imageWithCrops,
        'placeholder image': false,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GuideStopCard>;

export const Basic: Story = {
  name: 'GuideStopCard',
};
