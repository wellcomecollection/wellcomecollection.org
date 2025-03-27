import { Meta, StoryObj } from '@storybook/react';

import { event } from '@weco/cardigan/stories/data/content';
import EventPromo from '@weco/content/components/EventPromo/EventPromo';

const meta: Meta<typeof EventPromo> = {
  title: 'Components/Cards/EventPromo',
  component: EventPromo,
  args: {
    position: 0,
    event,
  },
  parameters: {
    gridSizes: {
      s: ['auto', 12],
      m: ['auto', 6],
      l: ['auto', 4],
      xl: ['auto', 4],
    },
  },
};

export default meta;

type Story = StoryObj<typeof EventPromo>;

export const Basic: Story = {
  name: 'EventPromo',
};
